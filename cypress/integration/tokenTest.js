/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing token creation
 *
 */

describe('Token creation test', function() {

    it('Log in and check for token', function() {
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

    it('Log out and check for token', function() {

        //should click on the logout button, but cannot handle with windows promt
        cy.clearLocalStorage()

        //check if the local storage is created.
        expect(localStorage.getItem('userData')).to.be.null
        expect(localStorage.getItem('token')).to.be.null

    });



})
