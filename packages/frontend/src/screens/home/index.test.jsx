import React from 'react'
import { mount } from '@cypress/react'
import App from '.'
import Strings from '../../localization/strings'
import { MenuOptions } from '../../components/menu/types'
import { AddItemModel } from '../../components/modal'
import { bucketName, defaultState, updateMenu } from '../../services/aws'

let state = {}

describe('App', () => {
  beforeEach(() => {
    mount(
      <>
        <App />
        <div id="modal-root" />
        <AddItemModel />
      </>,
    )
    cy.intercept({
      method: 'GET',
      url: `https://s3.us-east-2.amazonaws.com/${bucketName}/meals/*`,
    }, async (req) => {
      req.reply({ body: state })
    }).as('getFile')
    cy.intercept({
      method: 'PUT',
      url: `https://s3.us-east-2.amazonaws.com/${bucketName}/meals/*`,
    }, (req) => {
      state = req.body
      req.reply(state)
    }).as('putFile')
  })
  after(() => {
    updateMenu({ body: defaultState })
  })

  /*
   * All these tests share state and are dependent on the order in which they are run
  */
  it('Completes full form', () => {
    cy.wait('@getFile')
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').type('Gauchito')
    cy.get('select[name="category"]').select(MenuOptions.drinks)
    cy.get('input[name="dish"]').type('Fernu')
    cy.get('input[name="description"]').type('Te da energia')
    cy.get('button').contains(Strings.save).click()
    cy.get('h3').contains('Gauchito')
    cy.get('h3').contains('Fernu')
    cy.get('p').contains('Te da energia')
  })

  it('Completes form with only name', () => {
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').type('Santiago Motorizado')
    cy.get('button').contains(Strings.save).click()
    cy.get('h3').contains('Santiago Motorizado')
  })

  it('Errors with no name', () => {
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').focus()
    cy.get('span').contains('Name is required.')
  })

  it('Errors with category and no dish', () => {
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').type('Pablo')
    cy.get('select[name="category"]').select(MenuOptions.appetizer)
    cy.get('input[name="dish"]').focus()
    cy.get('span').contains('Dish is required.')
  })

  it('Errors with category and no description', () => {
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').type('Pablo')
    cy.get('select[name="category"]').select(MenuOptions.appetizer)
    cy.get('input[name="description"]').focus()
    cy.get('span').contains('Description is required.')
  })

  it('You can edit an Item', () => {
    const name = 'John Silver'
    const dish = 'Fish'
    const description = 'Fried'
    cy.get('button').contains(Strings.signup).click()
    cy.get('input[name="name"]').type(name)
    cy.get('select[name="category"]').select(MenuOptions.entre)
    cy.get('input[name="dish"]').type(dish)
    cy.get('input[name="description"]').type(description)
    cy.get('button').contains(Strings.save).click()
    cy.wait('@putFile')
    cy.get('h3').contains(name)
    cy.get('h3').contains(dish)
    cy.get('p').contains(description)
    cy.get('button').contains(Strings.edit).click()
    cy.get('img[alt="Open Edit Modal"]').first().click()
    cy.get('input[name="name"]').type(`${name} - Edit`)
    cy.get('select[name="category"]').select(MenuOptions.drinks)
    cy.get('input[name="dish"]').type(`${dish} - Edit`)
    cy.get('input[name="description"]').type(`${description} - Edit`)
    cy.get('button').contains(Strings.save).click()
    cy.get('h3').contains(`${name} - Edit`)
    cy.get('h3').contains(`${dish} - Edit`)
    cy.get('p').contains(`${description} - Edit`)
    cy.get('.component__menu').get('h3').contains(/^John Silver$/).should('not.exist')
    cy.get('h3').contains(/^Fish$/).should('not.exist')
    cy.get('p').contains(/^Fried$/).should('not.exist')
  })

  it('Can delete Guest', () => {
    cy.get('button').contains(Strings.edit).click()
    cy.get('img[alt="Delete Guest"]').first().click()
    cy.get('.component__guests').get('h3').contains('Gauchito').should('not.exist')
  })

  it('Can delete Item', () => {
    cy.get('button').contains(Strings.edit).click()
    cy.get('img[alt="Open Edit Modal"]').last().click()
    cy.get('button').contains(Strings.delete).click()
    cy.get('.component__menu').contains('Fernu').should('not.exist')
    cy.get('p').contains('Te da energia').should('not.exist')
  })
})
