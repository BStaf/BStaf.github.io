import os
import sys
from pathlib import Path


def load_ignore_file(ignore_file_path):
    ignore_set = set()
    if not ignore_file_path.exists():
        return ignore_set

    with ignore_file_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                ignore_set.add(line)
    return ignore_set


def should_ignore(path: Path, ignore_set):
    parts = set(path.parts)
    return any(part in ignore_set for part in parts)


def is_binary(file_path: Path):
    try:
        with file_path.open("rb") as f:
            chunk = f.read(1024)
            return b"\0" in chunk
    except Exception:
        return True


def collect_files(root_dir: Path, ignore_set):
    output_chunks = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirpath = Path(dirpath)

        # Skip ignored directories
        dirnames[:] = [
            d for d in dirnames
            if not should_ignore(dirpath / d, ignore_set)
        ]

        for filename in filenames:
            file_path = dirpath / filename

            if should_ignore(file_path, ignore_set):
                continue

            if is_binary(file_path):
                continue

            try:
                content = file_path.read_text(encoding="utf-8")
            except Exception:
                continue

            relative_path = file_path.relative_to(root_dir)
            output_chunks.append(f"{relative_path}:\n{content}\n")

    return "\n".join(output_chunks)


def main():
    if len(sys.argv) < 2:
        print("Usage: python dump_tree.py <directory>")
        sys.exit(1)

    root_dir = Path(sys.argv[1]).resolve()

    if not root_dir.is_dir():
        print("Invalid directory")
        sys.exit(1)

    ignore_file = root_dir / "ignorestuff.txt"
    ignore_set = load_ignore_file(ignore_file)

    output = collect_files(root_dir, ignore_set)

    print(output)


if __name__ == "__main__":
    main()
