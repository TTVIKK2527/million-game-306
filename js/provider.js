// The simulation boundary is replaceable by a server-side AI provider.
window.QuestionProvider = {
  async generate({files, bank}) {
    if (!files || !files['assignment.md'] || Object.keys(files).length < 2) {
      throw new Error('Ülesande kirjeldus ja lahenduse failid on vajalikud.');
    }
    return Questions.selectQuestions(bank, 15);
  }
};
