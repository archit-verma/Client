/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing signup process
 */
describe('SignUp page test', function() {

    it('Signup as athlete', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[2]').click()
        //select athlete
        cy.xpath('//*[@id="root"]/div/div[5]/div/span[1]').click()

        //type in a new username
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[1]/input').type(Cypress.env("newAthleteusername"),{force: true}).should('have.value',Cypress.env("newAthleteusername"))

        //type in a new firstname
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[2]/input').type(Cypress.env("newAthletefirstname"),{force: true}).should('have.value',Cypress.env("newAthletefirstname"))

        //type in a new lastname
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[3]/input').type(Cypress.env("newAthletelastname"),{force: true}).should('have.value',Cypress.env("newAthletelastname"))

        //type in a new dob
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[4]/input').type(Cypress.env("newAthletedob"),{force: true}).should('have.value',Cypress.env("newAthletedob"))

        //type in a new phone
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[5]/input').type(Cypress.env("newAthletephone"),{force: true}).should('have.value',Cypress.env("newAthletephone"))

        //type in a new email
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[6]/input').type(Cypress.env("newAthleteemail"),{force: true}).should('have.value',Cypress.env("newAthleteemail"))

        //type in a new password
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[7]/input').type(Cypress.env("newAthletepassword"),{force: true}).should('have.value',Cypress.env("newAthletepassword"))

        //confirm the password
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[8]/input').type(Cypress.env("newAthletepassword"),{force: true}).should('have.value',Cypress.env("newAthletepassword"))

        cy.xpath('//*[@id="root"]/div/div[5]/form/span/button').click({force: true})


    });

    it('Signup as coach', function() {
        //go to the home page
        cy.visit('/')
        //clear local storage
        cy.clearLocalStorage()
        //click on the profile button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div').click()
        //click on the login button
        cy.xpath('//*[@id="root"]/div/div[1]/div[2]/div/div/div[2]').click()
        //select Coach
        cy.xpath('//*[@id="root"]/div/div[5]/div/span[1]').click()

        //type in a new username
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[1]/input').type(Cypress.env("newCoachusername"),{force: true}).should('have.value',Cypress.env("newCoachusername"))

        //type in a new firstname
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[2]/input').type(Cypress.env("newCoachfirstname"),{force: true}).should('have.value',Cypress.env("newCoachfirstname"))

        //type in a new lastname
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[3]/input').type(Cypress.env("newCoachlastname"),{force: true}).should('have.value',Cypress.env("newCoachlastname"))

        //type in a new dob
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[4]/input').type(Cypress.env("newCoachdob"),{force: true}).should('have.value',Cypress.env("newCoachdob"))

        //type in a new phone
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[5]/input').type(Cypress.env("newCoachphone"),{force: true}).should('have.value',Cypress.env("newCoachphone"))

        //type in a new email
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[6]/input').type(Cypress.env("newCoachemail"),{force: true}).should('have.value',Cypress.env("newCoachemail"))

        //type in a new password
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[7]/input').type(Cypress.env("newCoachpassword"),{force: true}).should('have.value',Cypress.env("newCoachpassword"))

        //confirm the password
        cy.xpath('//*[@id="root"]/div/div[5]/form/div[8]/input').type(Cypress.env("newCoachpassword"),{force: true}).should('have.value',Cypress.env("newCoachpassword"))

        cy.xpath('//*[@id="root"]/div/div[5]/form/span/button').click({force: true})


    });


})
