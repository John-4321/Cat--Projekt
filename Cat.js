const fs = require("node:fs");

const args = process.argv.slice(2);

var n = false;

var E = false;

var s = false;

var T = false;

var b = false;

var skipLine = false;

//var filesOnly without the rest of args
var filesOnly = args;

var counter = 1;

var dontPrint = false;

//checks if cat command is used
//if true, runs the rest of the programm
//else it wont do anything except: console.log(`${args[0]}: Befehl nicht gefunden.`)
if (args[0] === "cat") {
  
  //disconnects every input that is not a file from filesOnly with splice
  filesOnly.splice(filesOnly.indexOf("cat"), 1);

  //if args include --help 
  //show help and close
  //else runs the rest of the programm
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
    
    //checks if args include options
    //and disconnects them from files only
    //that is so we can read the files all at once
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


    //for every file input
    //read file and split it into its single lines
    for (let i = 0; i < filesOnly.length; i++) {

      try {

        //reads single files
        var data = fs.readFileSync(filesOnly[i], "utf8");
        
        //splits single files into single lines
        var dataSplittedInLines = data.split("\n");

        //looks if s is true
        //then it will look for empty lines
        //when it finds empty line, it will set skip line to true 
        //if the next line is empty it looks if skip line is true and if it is true it wont print another empty line until there is text again
        dataSplittedInLines.forEach(line => {
          if (s) {
            if (line.trim() === "") {
              if (skipLine === false) {
                skipLine = true;
              } else { dontPrint = true }
            }
            else skipLine = false;
          }

          //if -T was in the input it will set the T bool to true and executes this codeblock
          //same for following code
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

          //prints the line after it got modified
          //except it didnt pass the empty line check wich sets dontPrint to true
          if (dontPrint === false) {
            console.log(line);
          }

          //resets the dontPrint for up comming lines
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
      } 

        //if something got stuck in files only that is not a file
        //print: not a file
      catch (err) {
        console.error("thats not a file");
        counter = 1;
      }
    }
  }
}
else {
  console.log(`${args[0]}: Befehl nicht gefunden.`)
}
