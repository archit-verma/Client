/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing wrong login cred
 *
 */
describe('Try wrong login credentials', function() {

    it('Try wrong username and password', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[1]').click()
        //type in the username and password
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[1]/div/input').type(Cypress.env("wrongusername")).should('have.value',Cypress.env("wrongusername"))
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[2]/div/input').type(Cypress.env("wrongpassword")).should('have.value',Cypress.env("wrongpassword"))

        //check if the local storage is created.
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/button').click().should(() => {
            expect(localStorage.getItem('userData')).to.be.null
            expect(localStorage.getItem('token')).to.be.null
        })

    });

    it('Try correct username and  wrong password', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[1]').click()
        //type in the username and password
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[1]/div/input').type(Cypress.env("correctusename")).should('have.value',Cypress.env("correctusename"))
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[2]/div/input').type(Cypress.env("wrongpassword")).should('have.value',Cypress.env("wrongpassword"))

        //check if the local storage is created.
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/button').click().should(() => {
            expect(localStorage.getItem('userData')).to.be.null
            expect(localStorage.getItem('token')).to.be.null
        })

    });

    it('Try wrong username and  a correct password', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[1]').click()
        //type in the username and password
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[1]/div/input').type(Cypress.env("wrongusername")).should('have.value',Cypress.env("wrongusername"))
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/div[2]/div/input').type(Cypress.env("correctpassword")).should('have.value',Cypress.env("correctpassword"))

        //check if the local storage is created.
        cy.xpath('//*[@id="root"]/div/div[6]/div[2]/form/button').click().should(() => {
            expect(localStorage.getItem('userData')).to.be.null
            expect(localStorage.getItem('token')).to.be.null
        })

    });


})
