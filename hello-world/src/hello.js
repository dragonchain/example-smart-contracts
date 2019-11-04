module.exports = async function (fullTransaction) {
  if (!fullTransaction || !fullTransaction.payload || !fullTransaction.payload.name) {
    return { error: "I can't say hi if I don't know your name!" };
  }
  return { greeting: `Hello ${fullTransaction.payload.name}!`}
}