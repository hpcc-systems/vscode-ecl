# Documentation Vector Database

The documentation vector database is generated from the HPCC-Platform ECL documentation. The generator uses Ollama to create embeddings with the same `nomic-embed-text-v1.5.Q4_K_M.gguf` model used by the extension at runtime.

## Prerequisites

1. Install the project dependencies from the repository root:

   ```bash
   npm install
   ```

2. Install Ollama from [ollama.com](https://ollama.com), then verify that it is available:

   ```bash
   ollama --version
   ```

3. Start Ollama in a separate terminal:

   ```bash
   ollama serve
   ```

4. Download the exact GGUF model used by the extension and create the Ollama model:

   ```bash
   mkdir -p /tmp/ecl-nomic-embed-text
   curl -L "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/nomic-embed-text-v1.5.Q4_K_M.gguf" \
     -o /tmp/ecl-nomic-embed-text/nomic-embed-text-v1.5.Q4_K_M.gguf
   printf 'FROM ./nomic-embed-text-v1.5.Q4_K_M.gguf\n' > /tmp/ecl-nomic-embed-text/Modelfile
   ollama create ecl-nomic-embed-text -f /tmp/ecl-nomic-embed-text/Modelfile
   ```

   The generator uses the Ollama model `ecl-nomic-embed-text` at `http://localhost:11434` by default. Set `OLLAMA_BASE_URL` if the server is running elsewhere.

5. Check out HPCC-Platform. The generator expects these directories below the supplied path:

   ```text
   EN_US/ECLProgrammersGuide/PRG_Mods
   EN_US/ECLLanguageReference/ECLR_mods
   EN_US/ECLStandardLibraryReference/SLR-Mods
   ```

## Generate the Vector Database

From the repository root, build the utility bundle and run the generator:

```bash
npm run build-ts
npm run gen-docs-vecdb -- ~/git/HPCC-Platform
```

The command accepts either the HPCC-Platform checkout root or its `docs` directory:

```bash
npm run gen-docs-vecdb -- ~/git/HPCC-Platform/docs
```

The generated compressed database is written to `util/docs.vecdb`. The regular extension build copies it to `dist/docs.vecdb`.

To validate the documentation layout without making embedding requests or changing the database, use dry-run mode:

```bash
npm run gen-docs-vecdb -- -d ~/git/HPCC-Platform
```

The generator prints each documentation page and embedding chunk as it runs. A run can take a while because every chunk is sent to Ollama.
