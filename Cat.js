const fs = require("node:fs");

const args = process.argv.slice(2);

var n = false;

var E = false;

var s = false;

var T = false;

var b = false;

var skipLine = false;

var filesOnly = args;

var counter = 1;

var dontPrint = false;

if (args[0] === "cat") {

  filesOnly.splice(filesOnly.indexOf("cat"), 1);
  if (args.includes("--help")) {
    console.log(`Aufruf: cat [OPTION]... [DATEI]...

  -b, --number-nonblank    nichtleere Ausgabezeilen nummerieren
  -E, --show-ends          $ am Ende jeder Zeile ausgeben
  -n, --number             alle Ausgabezeilen nummerieren
  -s, --squeeze-blank      aufeinander folgende Leerzeilen unterdrücken
  -T, --show-tabs          Tabulator-Zeichen als ^I ausgeben

  --help     diese Hilfe anzeigen und beenden`)
  }
  else {

    if (args.includes("-n")) {
      filesOnly.splice(filesOnly.indexOf("-n"), 1);
      n = true;
    }

    if (args.includes("-b")) {
      filesOnly.splice(filesOnly.indexOf("-b"), 1);
      b = true;
      n = false;
    }

    if (args.includes("-T")) {
      filesOnly.splice(filesOnly.indexOf("-T"), 1);
      T = true;
    }

    if (args.includes("-E")) {
      filesOnly.splice(filesOnly.indexOf("-E"), 1);
      E = true;
    }

    if (args.includes("-s")) {
      filesOnly.splice(filesOnly.indexOf("-s"), 1);
      s = true;
    }

    for (let i = 0; i < filesOnly.length; i++) {

      try {
        var data = fs.readFileSync(filesOnly[i], "utf8");
        var dataSplittedInLines = data.split("\n");



        //line === "\n" was the wrong method to detect empty lines
        dataSplittedInLines.forEach(line => {
          if (s) {
            if (line.trim() === "") {
              if (skipLine === false) {
                skipLine = true;
              } else { dontPrint = true }
            }
            else skipLine = false;
          }

          if (T) {
            line = line.replaceAll("\t", "^I");
          }

          if (b) {
            if (line != "") {
              line = counter + " " + line;
              counter++;
            }
          }

          if (n) {
            line = counter + " " + line;
            counter++;
          }

          if (E) {
            line = line + "$";
          }

          if (dontPrint === false) {
            console.log(line);
          }

          dontPrint = false;
        });


        //   var data = fs.readFileSync(filesOnly[i], "utf8");
        //   var dataSplittedInLines = data.split("\n");

        //   if (n === true && E === true){
        //     for (let i = 0; i < dataSplittedInLines.length; i++) {
        //       console.log(counter + dataSplittedInLines[i] + "$");
        //       counter++;
        //     }
        //   }else if(n === true && E === false){
        //     for (let i = 0; i < dataSplittedInLines.length; i++) {
        //       console.log(counter + dataSplittedInLines[i]);
        //       counter++;
        //     }
        //   }else if (n === false && E === true){
        //     for (let i = 0; i < dataSplittedInLines.length; i++) {
        //       console.log(dataSplittedInLines[i] + "$");
        //     }
        //   }else {console.log(data);}


        // 
      } catch (err) {
        console.error("thats not a file");
        counter = 1;
      }
    }
  }
}
else {
  console.log(`${args[0]}: Befehl nicht gefunden.`)
}
