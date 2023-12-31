describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user1 = {
            name: 'Nicole Formenti',
            username: 'testaway',
            password: 'test1'
        }
        const user2 = {
            name: 'Nicole Pedroia',
            username: 'testaway2',
            password: 'test12'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user1)
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.get('#login-form')
        cy.contains('Log in to application')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('FlyingTest1')
            cy.get('#password').type('test123')
            cy.get('#login-button').click()

            cy.contains('Nicole Formenti logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('FlyingTest1')
            cy.get('#password').type('wrongpassword')
            cy.get('#login-button').click()

            cy.get('html')
                .should('not.contain', 'Nicole Formenti logged in')
                .and('contain', 'Wrong credentials')

            cy.get('#error')
                .should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'testaway', password: 'test1' })
        })

        it('A blog can be created', function () {
            cy.get('#create-new-blog-button').click()

            cy.get('#title').type('This is a Cypress test')
            cy.get('#author').type('Nicole Formenti-Pedroia')
            cy.get('#url').type('http://www.nick.com')

            cy.get('#submit-button').click()

            cy.get('html').should('contain', 'a new blog named This is a Cypress test has been added')
        })
    })

    describe('When logged in and several blog posts already exist', function() {
        beforeEach(function() {
            cy.login({ username: 'testaway', password: 'test1' })
            cy.createBlog({ title: 'First Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })
            cy.createBlog({ title: 'Second Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })
            cy.createBlog({ title: 'Third Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })
        })

        it('The user can like a blog post', function () {
            cy.contains('Second Cypress note').find('#view-button').click()
            cy.contains('Second Cypress note').parent().find('#like-button').as('likeButton')
            cy.get('@likeButton').click()
            cy.get('@likeButton').click()
            cy.get('@likeButton').click()
            cy.contains('Second Cypress note').parent().contains('likes 3')
        })

        it('The user can delete one of their own posts', function () {
            cy.contains('Second Cypress note').find('#view-button').click()
            cy.contains('Second Cypress note').parent().find('#delete-button').click()
            cy.get('html')
                .should('not.contain', 'Second Cypress note')
        })

        it('A user cannot delete someone else\'s blog post', function() {
            cy.get('#logout-button').click()
            cy.login({ username: 'testaway2', password: 'test12' })

            cy.contains('Second Cypress note').find('#view-button').click()
            cy.contains('Second Cypress note').parent()
                .should('not.contain', 'delete')
        })
    })

    describe('When logged in with several blog posts created and liked', function() {
        beforeEach(function() {
            cy.login({ username: 'testaway', password: 'test1' })
            cy.createBlog({ title: 'First Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })
            cy.createBlog({ title: 'Second Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })
            cy.createBlog({ title: 'Third Cypress note', author: 'Nicole Formenti', url: 'http://www.nick.com' })

            cy.contains('Second Cypress note').find('#view-button').click()
            cy.contains('First Cypress note').find('#view-button').click()
            cy.contains('Third Cypress note').find('#view-button').click()

            // Cypress clicks too fast for our app's state, so we have to ensure that
            // the state has been updated between each click.
            cy.contains('Third Cypress note').parent().find('#like-button').as('likeButton3')
            cy.get('@likeButton3').click()
            cy.contains('Third Cypress note').parent().contains('likes 1')
            cy.get('@likeButton3').click()
            cy.contains('Third Cypress note').parent().contains('likes 2')
            cy.get('@likeButton3').click()
            cy.contains('Third Cypress note').parent().contains('likes 3')

            cy.contains('Second Cypress note').parent().find('#like-button').as('likeButton2')
            cy.get('@likeButton2').click()
            cy.contains('Second Cypress note').parent().contains('likes 1')
            cy.get('@likeButton2').click()
            cy.contains('Second Cypress note').parent().contains('likes 2')
            cy.get('@likeButton2').click()
            cy.contains('Second Cypress note').parent().contains('likes 3')
            cy.get('@likeButton2').click()
            cy.contains('Second Cypress note').parent().contains('likes 4')
            cy.get('@likeButton2').click()
            cy.contains('Second Cypress note').parent().contains('likes 5')
        })

        it('Blog posts are ordered from most liked to least liked', function() {
            cy.get('html')
                .find('.like-span')
                // Make an array with the "likes" number of each post, from top to bottom.
                .then(function(response) {
                    const likesArray = response.map(function(i, b) {
                        return Number(b.innerHTML)
                    })

                    // And then check whether the numbers in likesArray are sorted from highest to lowest.
                    let sorted = true

                    for (let i = 0; i < likesArray.length - 1; i++) {
                        if (likesArray[i] < likesArray[i+1]) {
                            sorted = false
                            break
                        }
                    }

                    expect(sorted).to.be.true
                })

            cy.get('span:first').contains('5')
            cy.get('span:last').contains('0')
        })
    })
})