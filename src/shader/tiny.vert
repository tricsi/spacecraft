precision mediump float;
attribute vec3 aPos, aNorm;
uniform mat4 uWorld, uProj;
uniform mat3 uInverse;
uniform float uStroke;
varying vec4 vPos;
varying vec3 vNorm;
void main(void) {
	vec3 pos = aPos + (aNorm * uStroke);
	vPos = uWorld * vec4(pos, 1.0);
	vNorm = uInverse * aNorm;
	gl_Position = uProj * vPos;
}
