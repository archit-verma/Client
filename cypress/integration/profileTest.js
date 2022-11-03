/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing editing the profile
 *
 */
describe('Editing the profile page', function() {

    it('Log in', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[1]').click()
        //type in the username and password
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[1]/div/input').type('uvin').should('have.value','uvin')
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[2]/div/input').type('1').should('have.value','1')

        //check if the local storage is created.
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/button').click().should(() => {
            expect(localStorage.getItem('userData')).to.not.be.null
            expect(localStorage.getItem('token')).to.not.be.null
        })


    });


    it('Load profile page', function() {
        cy.xpath('//*[@id="root"]/div/div[1]/div[3]/img').click()

        cy.wait(2000)

    });


    it('Open edit profile', function() {
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]').click()

    });


    it('edit profile', function() {
        cy.xpath('//*[@id="root"]/div/div[5]/form[1]/div[6]/input').type("{backspace}{backspace}12",{force: true}).should('have.value','3232312')

        cy.xpath('//*[@id="root"]/div/div[5]/form[1]/button').click({force: true})
        //got back to profile
        cy.xpath('//*[@id="root"]/div/div[3]/div[2]/button').click({force: true})
    });












})
