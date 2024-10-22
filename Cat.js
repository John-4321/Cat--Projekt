function main() {
    const fs = require('fs');

    const args = process.argv.slice(2);
    let filesOnly = args;

    let switches = {
        squeezeBlank: false,
        number: false,
        numberNonblank: false,
        showTabs: false,
        showEnds: false
    };

    let lastLineEmpty = false;
    let dontPrintLine = false;

    let counter = 1;

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
            switches.squeezeBlank = FsOnlyIncludesOption("-s");
            switches.number = FsOnlyIncludesOption("-n");
            switches.numberNonblank = FsOnlyIncludesOption("-b");
            if (switches.number && switches.numberNonblank) {
                switches.number = false;
            }
            switches.showTabs = FsOnlyIncludesOption("-T");
            switches.showEnds = FsOnlyIncludesOption("-E");
            for (let i = 0; i < filesOnly.length; i++) {
                try {
                    let fileSplittedInLines = fs.readFileSync(filesOnly[i], "utf8").split("\n");
                    fileSplittedInLines.forEach(line => {
                        if (switches.squeezeBlank) {
                            if (line === "") {
                                if (lastLineEmpty === true) {
                                    dontPrintLine = true;
                                } else {
                                    lastLineEmpty = true;
                                }
                            } else lastLineEmpty = false;
                        }
                        if (switches.number) {
                            line = counter + " " + line;
                            counter++;
                        }
                        if (switches.numberNonblank) {
                            if (line != "") {
                                line = counter + " " + line;
                                counter++;
                            }
                        }
                        if (switches.showTabs) {
                            line = line.replaceAll("\t", "^I");
                        }
                        if (switches.showEnds) {
                            line = line + "$";
                        }
                        if (dontPrintLine === false) {

                            console.log(line);

                        }
                        dontPrintLine = false;
                    });
                } catch (err) {
                    console.error("Error");
                    counter = 1;
                }
            }
        }
    } else {
        console.log(`${args[0]}: Befehl nicht gefunden.`)
    }
    //functions
    //FsOnly == filesOnly
    function FsOnlyIncludesOption(option) {
        if (filesOnly.includes(option)) {
            filesOnly.splice(filesOnly.indexOf(option), 1)
            return true
        }
    }
}

main();
