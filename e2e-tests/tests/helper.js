const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createPerson = async (page, name, number)  => {
    await page.getByRole('button', { name: 'Add Person' }).click()
    await page.getByTestId('name').fill(name)
    await page.getByTestId('number').fill(number)
    //set up a listner to listen for any dialogs after this point
    page.on('dialog', async (dialog) => {
        console.log('Dialog triggered: ', dialog.message()); // Debugging the dialog message
        await dialog.accept(); // Accepting the confirmation dialog
    });
    await page.getByRole('button', { name: 'Add' }).click();
}
  
export { loginWith, createPerson }