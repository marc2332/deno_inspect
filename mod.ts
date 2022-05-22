import { Command } from "https://deno.land/x/cliffy@v0.24.2/command/mod.ts";

await new Command()
  .name("inspect")
  .version("0.1.0")
  .description("Inspect generated binaries by Deno.")
  .command(
    "analyze",
    new Command()
      .arguments("<input:string>")
      .action((_, input) => {
        analyze(input as unknown as string);
      }),
  )
  .command(
    "uncompile",
    new Command()
      .arguments("<input:string> <output:string>")
      .action((_, input, output) => {
        uncompile(input as unknown as string, output as unknown as string);
      }),
  )
  .parse(Deno.args);

async function analyze(bin: string) {
  const { metadata } = await getData(bin);
  console.log(metadata);
}

async function getData(bin: string) {
  const file = await Deno.open(bin);

  const trailer_pos = await file.seek(-24, Deno.SeekMode.End);

  const buf = new Uint8Array(24);

  await file.read(buf);

  const trailer = new TextDecoder().decode(buf.slice(0, 8)); // d3n0l4nd

  if (trailer !== "d3n0l4nd") {
    console.error("Error: Specified binary is not a Deno app.");
    Deno.exit(1);
  }

  const eszip_pos = byteArrayToNumber(buf.slice(8, 16));
  const metadata_pos = byteArrayToNumber(buf.slice(16, 24));
  const metdata_len = trailer_pos - metadata_pos;

  await file.seek(metadata_pos, Deno.SeekMode.Start);

  const metadata_array = new Uint8Array(metdata_len);

  await file.read(metadata_array);

  const metadata_str = new TextDecoder().decode(metadata_array);
  const metadata = JSON.parse(metadata_str);

  file.close();

  return {
    eszip_pos,
    metadata,
  };
}

async function uncompile(bin: string, outputBin: string) {
  const { eszip_pos } = await getData(bin);

  await Deno.copyFile(bin, outputBin);
  await Deno.truncate(outputBin, eszip_pos);

  console.log(`Uncompiled original Deno binary in ${outputBin}`);
}

function byteArrayToNumber(array: Uint8Array) {
  let value = 0;
  for (let i = 0; i < array.length; i++) {
    value = (value * 256) + array[i];
  }
  return value;
}
