#!/usr/bin/env python3
"""Generate SwitchUp Studio Kokoro MP3 narration assets.

Reads docs/content-reference.md, generates one MP3 per reference ID, and updates
assets/narration/af_heart/manifest.json for the browser player.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from mlx_audio.tts.generate import generate_audio
from mlx_audio.tts.utils import load_model


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DOC = ROOT / "docs" / "content-reference.md"
OUT_DIR = ROOT / "assets" / "narration" / "af_heart"
MANIFEST = OUT_DIR / "manifest.json"
MODEL_ID = "mlx-community/Kokoro-82M-bf16"
VOICE = "af_heart"
LANG_CODE = "a"


def strip_cell(value: str) -> str:
    value = value.strip()
    if value.startswith("`") and value.endswith("`"):
        value = value[1:-1]
    return value.replace("\\|", "|").strip()


def parse_reference_doc() -> list[dict[str, str]]:
    markdown = REFERENCE_DOC.read_text(encoding="utf-8")
    rows: list[dict[str, str]] = []
    section = "Content"
    for line in markdown.splitlines():
        heading = re.match(r"^#{2,3}\s+(.+)", line)
        if heading:
            section = heading.group(1).strip()
            continue

        if not line.startswith("| `"):
            continue

        cells = [cell.strip() for cell in re.split(r"(?<!\\)\|", line)[1:-1]]
        if len(cells) < 2:
            continue

        ref_id = strip_cell(cells[0])
        text = strip_cell(cells[2] if len(cells) >= 3 else cells[1])
        if ref_id and text:
            rows.append({"refId": ref_id, "text": text, "section": section})
    return rows


def read_manifest_files() -> list[str]:
    if not MANIFEST.exists():
        return []
    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    return [str(item).removesuffix(".mp3") for item in data.get("files", [])]


def write_manifest(files: list[str]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = {
        "voice": VOICE,
        "format": "mp3",
        "files": sorted(dict.fromkeys(files)),
    }
    MANIFEST.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def generate_one(model, ref_id: str, text: str, speed: float) -> bool:
    target = OUT_DIR / f"{ref_id}.mp3"
    if target.exists():
        return False

    print(f"Generating {ref_id}: {text}")
    generate_audio(
        text=text,
        model=model,
        voice=VOICE,
        speed=speed,
        lang_code=LANG_CODE,
        output_path=str(OUT_DIR),
        file_prefix=ref_id,
        audio_format="mp3",
        join_audio=True,
        verbose=False,
    )
    return target.exists()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Generate only the first N missing files.")
    parser.add_argument("--speed", type=float, default=1.0)
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = parse_reference_doc()
    row_ids = {row["refId"] for row in rows}
    manifest_files = set(read_manifest_files())
    existing_files = {path.stem for path in OUT_DIR.glob("*.mp3")}
    known_files = (manifest_files | existing_files) & row_ids

    missing = [row for row in rows if row["refId"] not in known_files]
    if args.limit:
      missing = missing[: args.limit]

    if not missing:
        write_manifest(sorted(known_files))
        print("No missing Kokoro MP3 files.")
        return

    print(f"Loading Kokoro model: {MODEL_ID}")
    model = load_model(MODEL_ID)

    generated: list[str] = []
    for row in missing:
        if generate_one(model, row["refId"], row["text"], args.speed):
            generated.append(row["refId"])

    final_files = sorted(known_files | set(generated))
    write_manifest(final_files)
    print(f"Generated {len(generated)} file(s). Manifest now has {len(final_files)} file(s).")


if __name__ == "__main__":
    main()
