// Simple audio generation for testing
// This creates basic sine wave audio files for demonstration

const fs = require('fs');
const path = require('path');

// Function to generate a simple sine wave audio buffer
function generateSineWave(frequency, duration, sampleRate = 44100) {
  const samples = duration * sampleRate;
  const buffer = new Float32Array(samples);
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    buffer[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3; // 30% volume
  }
  
  return buffer;
}

// Function to create a WAV file header
function createWavHeader(dataLength, sampleRate = 44100, channels = 1, bitsPerSample = 16) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataLength, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  
  // Format chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Chunk size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, channels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * channels * bitsPerSample / 8, true); // Byte rate
  view.setUint16(32, channels * bitsPerSample / 8, true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample
  
  // Data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataLength, true); // Data size
  
  return new Uint8Array(buffer);
}

// Generate test audio files
const tracks = [
  { name: 'track1.wav', frequency: 440, duration: 30 }, // A4 note
  { name: 'track2.wav', frequency: 523, duration: 25 }, // C5 note
  { name: 'track3.wav', frequency: 659, duration: 35 }, // E5 note
  { name: 'track4.wav', frequency: 784, duration: 28 }, // G5 note
];

tracks.forEach(track => {
  console.log(`Generating ${track.name}...`);
  
  const audioData = generateSineWave(track.frequency, track.duration);
  const pcmData = new Int16Array(audioData.length);
  
  // Convert float to 16-bit PCM
  for (let i = 0; i < audioData.length; i++) {
    pcmData[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32767));
  }
  
  const header = createWavHeader(pcmData.byteLength);
  const wavFile = new Uint8Array(header.length + pcmData.byteLength);
  
  wavFile.set(header, 0);
  wavFile.set(new Uint8Array(pcmData.buffer), header.length);
  
  fs.writeFileSync(path.join(__dirname, track.name), wavFile);
  console.log(`Generated ${track.name} (${track.duration}s, ${track.frequency}Hz)`);
});

console.log('All test audio files generated successfully!');
