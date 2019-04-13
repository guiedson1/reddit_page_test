const minhaPromisse = () => new Promise((resolve,reject) => {
  setTimeout(() => {resolve("OK")},2000);
});


async function executaPromisse() {
  console.log(await minhaPromisse());
  console.log(await minhaPromisse());
  console.log(await minhaPromisse());
}


executaPromisse();
