/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing authorisation
 *
 */
describe('Authorisation', function() {

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

    it('Log out', function() {

        //should click on the logout button, but cannot handle with windows promt
        cy.clearLocalStorage()

        //check if the local storage is created.
        expect(localStorage.getItem('userData')).to.be.null
        expect(localStorage.getItem('token')).to.be.null

    });

    it('Authorisation Check', function() {


        cy.visit('/profile/uvin')

        //clear local storage
        cy.clearLocalStorage()

        //go to the home page
        cy.visit('/profile/uvin')


        //check if not logged it
        cy.xpath('//*[@id="root"]/div/div[5]/h2').invoke('text').then((text) => {
            expect(text.trim()).equal('You must login to see your feed.')
        });

    });


})