/**
 * =====================================
 * END TO END TEST
 * =====================================
 * @date created: 1 Oct 2019
 * @authors: Uvin Abeysinghe\
 *
 * Testing new post creation
 *
 */
describe('create a new post and test its functionality', function() {

    it('Log in', function() {
        //clear local storage
        cy.clearLocalStorage()
        //go to the home page
        cy.visit('/')
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

    it('Create a post and check if it was created correctly', function() {

        //click on the home button
        cy.xpath('//*[@id="root"]/div/div[1]/div[1]/a[2]').click()
        cy.url().should('include', '/home')

        //type out a post
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[2]/form/textarea').type("Hello, this is a test bot").should('have.value','Hello, this is a test bot')
        //check the first radio button
        // cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[2]/form/div[2]/span[1]/input').check().should('be.checked')
        //press create post button and check if correct post created.
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[2]/form/button').click({force: true})
        cy.wait(1000)

        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[2]/p').invoke('text').then((text) => {
            expect(text.trim()).equal('Hello, this is a test bot')
        });


    });



    it('Check likes', function() {

        //check if number of likes is 0
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[1]').invoke('text').then((text) => {
            expect(text.trim()).equal('0')
        });

        //click on the like button
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[2]/label[1]').click({force: true})

        cy.wait(500)


        //check if number of likes is 1
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[1]').invoke('text').then((text) => {
            expect(text.trim()).equal('1')
        });

        cy.wait(1000)


    });



    it('Check bumslap', function() {

        //check if number of bumslap is 0
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[2]').invoke('text').then((text) => {
            expect(text.trim()).equal('0')
        });

        //click on the bumslap button
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[2]/label[2]').click({force: true})

        cy.wait(500)

        //check if number of bumslap is 1
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[2]').invoke('text').then((text) => {
            expect(text.trim()).equal('1')
        });

        cy.wait(1000)


    });



    it('Check backslap', function() {

        //check if number of backslap is 0
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[3]').invoke('text').then((text) => {
            expect(text.trim()).equal('0')
        });

        //click on the backslap button
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[2]/label[3]').click({force: true})

        cy.wait(500)


        //check if number of backslap is 1
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[3]/div[1]/span[3]').invoke('text').then((text) => {
            expect(text.trim()).equal('1')
        });

    });


    //add a comment
    it('Add a comment', function() {

        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[4]/div/textarea').type("Hello, this is a test bot, commenting ... judging{enter}",{force: true}).should('have.value','Hello, this is a test bot, commenting ... judging')

    });

    // click on the comment like button
    it('Check comment like', function() {

        //ideally click the button and test it as well.

        //check if number of like is 0
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[4]/div[1]/div[2]/div/span/text()').invoke('text').then((text) => {
            expect(text.trim()).equal('0')
        });

    });


    it('Edit post', function() {

        //click edit post
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[1]/div[2]/div[1]').click({force: true})
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[1]/div[2]/div[2]/div[1]').click({force: true})

        //edit the post
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[2]/div[1]/textarea').type(". yes, this post is edited.",{force: true}).should('have.value','Hello, this is a test bot. yes, this post is edited.')
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[2]/div[1]/button').click({force: true})
    });


    //delete the post.
    it('Delete post', function() {
        //delete the post
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[1]/div[2]/div[1]').click({force: true})
        cy.xpath('//*[@id="root"]/div/div[5]/div[1]/div[3]/div/div[1]/div[1]/div[2]/div[2]/div[2]').click({force: true})

    });
















})
