declare var window: any;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

const out = new AudioContext();
const gains: { [id: string]: GainNode } = {};
const buffers : { [id: string]: AudioBuffer } = {};
const keys: {[key: string]: number} = { c: 0, db: 1, d: 2, eb: 3, e: 4, f: 5, gb: 6, g: 7, ab: 8, a: 9, bb: 10, b: 11 };
const freq: number[] = [];
const bitrate: number = 44100;
let noise: AudioBuffer;

export class Sound {

    curve: Float32Array;

    constructor(
        public type: OscillatorType,
        curve: number[],
        public length: number,
    ) {
        this.curve = Float32Array.from(curve);
    }

    getTime(max: number): number {
        return (max < this.length ? max : this.length) - .01;
    }

}

export class Channel {

    public size: number = 0;
    public length: number = 0;
    private data: number[][] = [];

    constructor(
        public inst: Sound,
        notes: string,
        tempo: number
    ) {
        let sheet = notes.split("|");
        if (sheet.length > 1) {
            notes = "";
            for (let i = 0; i < sheet.length; i++) {
                notes += i % 2
                    ? ("," + sheet[i-1]).repeat(parseInt(sheet[i]) - 1)
                    : (notes ? "," : "") + sheet[i];
            }
        }
        notes.split(",").forEach((code) => {
            let div = code.match(/^(\d+)/),
                freqs = code.match(/([a-z]+\d+)/g);
            if (div) {
                let time = tempo / parseInt(div[1]),
                    row = [time];
                this.length += time;
                if (freqs) {
                    if (freqs.length > this.size) {
                        this.size = freqs.length;
                    }
                    for (let i = 0; i < freqs.length; i++) {
                        let note = freqs[i].match(/([a-z]+)(\d+)/);
                        if (note) {
                            row.push(freq[parseInt(note[2]) * 12 + keys[note[1]]]);
                        }
                    }
                }
                this.data.push(row);
            }
        });
    }

    play(ctx: OfflineAudioContext) {
        let length = 0;
        const inst = this.inst;
        const vol = ctx.createGain();
        const osc: OscillatorNode[] = [];
        vol.connect(ctx.destination);
        for (let i = 0; i < this.size; i++) {
            osc[i] = ctx.createOscillator();
            osc[i].type = inst.type;
            osc[i].connect(vol);
        }
        this.data.forEach(note => {
            if (inst.curve) {
                vol.gain.setValueCurveAtTime(inst.curve, length, inst.getTime(note[0]));
            }
            osc.forEach((o, i) => {
                o.frequency.setValueAtTime(note[i + 1] || 0, length);
            });
            length += note[0];
        });
        osc.forEach(o => {
            o.start();
            o.stop(length);
        });
    }

}

export default {

    async init(): Promise<void> {
        if (out.state === "suspended") {
            await out.resume();
        }
        const a = Math.pow(2, 1 / 12);
        for (let n = -57; n < 50; n++) {
            freq.push(Math.pow(a, n) * 440);
        }
        noise = out.createBuffer(1, bitrate * 2, bitrate);
        const output = noise.getChannelData(0);
        for (let i = 0; i < bitrate * 2; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    },

    async sound(id: string, sound: Sound, freq: number[], time: number): Promise<void> {
        const ctx = new OfflineAudioContext(1, bitrate * time, bitrate);
        const vol = ctx.createGain();
        const curve = Float32Array.from(freq);
        vol.connect(ctx.destination);
        if (sound.curve) {
            vol.gain.setValueCurveAtTime(sound.curve, 0, sound.getTime(time));
        }
        ctx.addEventListener("complete", (e) => buffers[id] = e.renderedBuffer);
        if (sound.type == "custom") {
            const filter = ctx.createBiquadFilter();
            filter.connect(vol);
            filter.detune.setValueCurveAtTime(curve, 0, time);
            const src = ctx.createBufferSource();
            src.buffer = noise;
            src.loop = true;
            src.connect(filter);
            src.start();
        } else {
            const osc = ctx.createOscillator();
            osc.type = sound.type;
            osc.frequency.setValueCurveAtTime(curve, 0, time);
            osc.connect(vol);
            osc.start();
            osc.stop(time);
        }
        await ctx.startRendering();
    },

    async music(id: string, channels: Channel[]): Promise<void> {
        const length = channels.reduce((length, channel) => channel.length > length ? channel.length : length, 0);
        const ctx = new OfflineAudioContext(1, bitrate * length, bitrate);
        ctx.addEventListener("complete", (e) => buffers[id] = e.renderedBuffer);
        channels.forEach((channel, i) => channel.play(ctx));
        await ctx.startRendering();
    },

    mixer(id: string): GainNode {
        if (!(id in gains)) {
            gains[id] = out.createGain();
            gains[id].connect(out.destination);
        }
        return gains[id];
    },

    play(id: string, loop: boolean = false, mixerId: string = "master"): AudioBufferSourceNode {
        if (id in buffers) {
            let src = out.createBufferSource();
            src.loop = loop;
            src.buffer = buffers[id];
            src.connect(this.mixer(mixerId));
            src.start();
            return src;
        }
        return null;
    }

}
