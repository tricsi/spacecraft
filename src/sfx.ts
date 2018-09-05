namespace SFX {

    declare var window: any;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

    const bitrate = 44100;
    const keys = { c: 0, db: 1, d: 2, eb: 3, e: 4, f: 5, gb: 6, g: 7, ab: 8, a: 9, bb: 10, b: 11 };
    const freq = [];
    const out = new AudioContext();
    const ctx = new OfflineAudioContext(1, bitrate * 2, bitrate);
    const noise = ctx.createBuffer(1, bitrate * 2, bitrate);
    const output = noise.getChannelData(0);
    const buffers : { [id: string]: AudioBuffer } = {};
    const gains: { [id: string]: GainNode } = {};

    let a = Math.pow(2, 1 / 12);
    for (let n = -57; n < 50; n++) {
        freq.push(Math.round(Math.pow(a, n) * 44000) / 100);
    }

    for (let i = 0; i < bitrate * 2; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    export class Sound {

        type: OscillatorType;
        curve: Float32Array;
        length: number;

        constructor(type: OscillatorType, curve: number[], length: number) {
            this.type = type;
            this.curve = Float32Array.from(curve);
            this.length = length;
        }

        time(max): number {
            return (max < this.length ? max : this.length) - .01;
        }

        async render(id: string, freq: number[], time: number): Promise<void> {
            let ctx = new OfflineAudioContext(1, bitrate * time, bitrate),
                vol = ctx.createGain(),
                curve = Float32Array.from(freq);
            vol.connect(ctx.destination);
            if (this.curve) {
                vol.gain.setValueCurveAtTime(this.curve, 0, this.time(time));
            }
            if (this.type == 'custom') {
                let src = ctx.createBufferSource(),
                    filter = ctx.createBiquadFilter();
                filter.connect(vol);
                filter.detune.setValueCurveAtTime(curve, 0, time);
                src.buffer = noise;
                src.loop = true;
                src.connect(filter);
                src.start();
            } else {
                let osc = ctx.createOscillator();
                osc.type = this.type;
                osc.frequency.setValueCurveAtTime(curve, 0, time);
                osc.connect(vol);
                osc.start();
                osc.stop(time);
            }
            ctx.addEventListener('complete', (e) => {
                buffers[id] = e.renderedBuffer;
            });
            await ctx.startRendering();
        }

    }

    export class Channel {

        inst: Sound;
        data: number[][];
        size: number;
        length: number;

        constructor(inst: Sound, notes: string, tempo: number) {
            this.inst = inst;
            this.data = [];
            this.size = 0;
            this.length = 0;
            let sheet = notes.split('|');
            if (sheet.length > 1) {
                notes = '';
                for (let i = 0; i < sheet.length; i++) {
                    notes += i % 2
                        ? (',' + sheet[i-1]).repeat(parseInt(sheet[i]) - 1)
                        : (notes ? ',' : '') + sheet[i];
                }
            }
            notes.split(',').forEach((code) => {
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
            let length = 0,
                inst = this.inst,
                vol = ctx.createGain(),
                osc = [];
            vol.connect(ctx.destination);
            for (let i = 0; i < this.size; i++) {
                osc[i] = ctx.createOscillator();
                osc[i].type = inst.type;
                osc[i].connect(vol);
            }
            this.data.forEach(note => {
                if (inst.curve) {
                    vol.gain.setValueCurveAtTime(inst.curve, length, inst.time(note[0]));
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

    export async function render(id: string, channels: Channel[]): Promise<void> {
        let length = 0;
        channels.forEach(channel => {
            if (channel.length > length) {
                length = channel.length;
            }
        });
        const ctx = new OfflineAudioContext(1, bitrate * length, bitrate);
        ctx.addEventListener('complete', (e) => {
            buffers[id] = e.renderedBuffer;
        });
        channels.forEach((channel, i) => {
            channel.play(ctx);
        });
        await ctx.startRendering();
    }

    export function mixer(id: string): GainNode {
        if (!(id in gains)) {
            gains[id] = out.createGain();
            gains[id].connect(out.destination);
        }
        return gains[id];
    }

    export async function play(id: string, loop: boolean = false, mixerId: string = 'master'): Promise<AudioBufferSourceNode> {
        await out.resume();
        if (id in buffers) {
            let src = out.createBufferSource();
            if (loop) {
                src.loop = true;
            }
            src.buffer = buffers[id];
            src.connect(mixer(mixerId));
            src.start();
            return src;
        }
        return null;
    }
}