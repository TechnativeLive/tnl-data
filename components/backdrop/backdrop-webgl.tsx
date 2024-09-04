import { Backdrop } from './backdrop'
import { useRef, useEffect, useState } from 'react'

export function BackdropWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) {
      console.error('WebGL not supported')
      setIsWebGLSupported(false)
      return
    }

    // Resize canvas to fill the screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Vertex shader
    const vsSource = `
      attribute vec4 aVertexPosition;
      varying vec2 vPosition;
      
      void main() {
        gl_Position = aVertexPosition;
        vPosition = aVertexPosition.xy;
      }
    `

    // Fragment shader
    const fsSource = `
  precision highp float;
  varying vec2 vPosition;
  uniform float uTime;

  // 3D Perlin noise function
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float perlin3d(vec3 P) {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = Pf0 * Pf0 * Pf0 * (Pf0 * (Pf0 * 6.0 - 15.0) + 10.0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  void main() {
    float scale = 5.0;
    float LOOP_PERIOD = 100.0; // Time in seconds for a full loop
    float angle = uTime * (2.0 * 3.14159 / LOOP_PERIOD);

    // Map 2D position to a circle in 3D space
    vec3 pos3d = vec3(
      vPosition.x,
      vPosition.y,
      angle
    );

    float n = perlin3d(scale * pos3d);

    // Create sharper contour effect with more uniform width
    float contourFrequency = 10.0; // Adjust to change contour line frequency
    float contourSharpness = 200.0; // Increase for sharper lines
    float nScaled = n * contourFrequency;
    float contourValue = abs(fract(nScaled) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.8, contourValue); // 0.02 controls line width
    contour = pow(contour, contourSharpness); // Sharpen the contour

    // Create a color for the contour lines
    vec3 contourColor = vec3(0.8, 0.9, 1.0); // Light blue

    // Set alpha based on contour
    float alpha = contour;

    gl_FragColor = vec4(contourColor, alpha);
  }
`

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders')
      setIsWebGLSupported(false)
      return
    }

    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader)

    if (!shaderProgram) {
      console.error('Failed to create shader program')
      setIsWebGLSupported(false)
      return
    }

    // Get the location of the time uniform
    const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'uTime')

    // Create a square
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // Set up WebGL state (moved outside the render loop)
    gl.useProgram(shaderProgram)
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    // Enable alpha blending
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Render loop
    let startTime = Date.now()
    function render() {
      if (!gl || !shaderProgram) return
      const currentTime = (Date.now() - startTime) / 1000 // time in seconds

      gl.clearColor(0.0, 0.0, 0.0, 0.0) // Set clear color with 0 alpha for transparency
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.uniform1f(timeUniformLocation, currentTime)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  if (!isWebGLSupported) return <Backdrop />

  return <canvas className="fixed inset-0 -z-50" ref={canvasRef} />
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) {
    console.error('Unable to create shader')
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const shaderProgram = gl.createProgram()
  if (!shaderProgram) {
    console.error('Unable to create shader program')
    return null
  }

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}
