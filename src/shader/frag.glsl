precision mediump float;
uniform mat4 uWorld;
uniform vec4 uColor;
uniform vec3 uLight;
varying vec4 vPos;
varying vec3 vNorm;
vec3 uAmbient = vec3(.2, .2, .2);
vec3 uDiffuse = vec3(.8, .8, .8);
vec3 uSpecular = vec3(.8, .8, .8);
void main(void) {
	vec3 lightDir = normalize(uLight - vPos.xyz);
	vec3 normal = normalize(vNorm);
	vec3 eyeDir = normalize(-vPos.xyz);
	vec3 reflectionDir = reflect(-lightDir, normal);
	float specularWeight = 0.0;
	if (uColor.w > 0.0) { specularWeight = pow(max(dot(reflectionDir, eyeDir), 0.0), uColor.w); }
	float diffuseWeight = max(dot(normal, lightDir), 0.0);
	vec3 weight = uAmbient + uSpecular * specularWeight  + uDiffuse * diffuseWeight;
	vec3 color = uColor.xyz * weight;
	gl_FragColor = vec4(color, 1);
}
