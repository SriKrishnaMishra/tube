import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function fetchFile(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return await res.text();
}

export async function downloadExtensionZip() {
  const zip = new JSZip();
  
  const files = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.css',
    'popup.js',
    'README.md',
  ];
  
  for (const file of files) {
    try {
      const content = await fetchFile(`/extension/${file}`);
      zip.file(file, content);
    } catch (err) {
      console.warn(`Could not fetch ${file}:`, err);
    }
  }
  
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'rectracker-extension-v1.zip');
}
