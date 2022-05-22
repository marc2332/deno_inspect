# 🪄 inspect

Analyze or uncompile apps created with Deno.

## ✨ Install

```shell
deno install https://deno.land/x/inspect/mod.ts
```

### inspect analyze

Analyze the specified binary:

```shell
inspect analyze my_app.exe
```

Output:

```sh
{
  argv: [],
  unstable: false,
  seed: null,
  permissions: {
    allow_env: null,
    allow_hrtime: false,
    allow_net: null,
    allow_ffi: null,
    allow_read: null,
    allow_run: null,
    allow_write: null,
    prompt: true
  },
  location: null,
  v8_flags: [],
  log_level: null,
  ca_stores: null,
  ca_data: null,
  unsafely_ignore_certificate_errors: null,
  maybe_import_map: null,
  entrypoint: "file:///C:/Users/mespi/Projects/uncompiler/example/my_app.ts"
}
```

### inspect uncompile

Uncompile the app:

```
inspect uncompile my_app.exe original_deno.exe
```

## Example

```
deno compile https://github.com/marc2332/deno_inspect/raw/main/example/my_app.ts
inspect analyze my_app.exe
```

Made by Marc Espín