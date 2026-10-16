import type { StudyRoomVoiceNote } from "@/types";

function writeText(view: DataView, offset: number, text: string) {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
}

export function createDemoVoiceNote(durationSeconds = 4): StudyRoomVoiceNote {
  const sampleRate = 8000;
  const sampleCount = sampleRate * durationSeconds;
  const buffer = new ArrayBuffer(44 + sampleCount);
  const view = new DataView(buffer);

  writeText(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount, true);
  writeText(view, 8, "WAVE");
  writeText(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeText(view, 36, "data");
  view.setUint32(40, sampleCount, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const syllable = Math.max(0, Math.sin(Math.PI * ((time * 3.2) % 1)));
    const pitch = 170 + 35 * Math.sin(time * 2.3);
    const value = Math.sin(2 * Math.PI * pitch * time) * syllable * 0.22;
    view.setUint8(44 + index, Math.round(128 + value * 127));
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return {
    src: `data:audio/wav;base64,${btoa(binary)}`,
    durationSeconds,
    mimeType: "audio/wav",
  };
}
