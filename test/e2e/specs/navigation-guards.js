module.exports = {
  'navigation guards': function (browser) {
    // alert commands not available in phantom
    if (process.env.PHANTOMJS) {
      return
    }

    browser
    .url('http://localhost:8080/navigation-guards/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(2) a')
      .dismissAlert()
      .waitFor(100)
      .acceptAlert() // redirect to home
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')

      .click('li:nth-child(2) a')
      .dismissAlert() // not saved
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')

      .click('li:nth-child(2) a')
      .acceptAlert() // not saved, force leave
      .waitFor(100)
      .dismissAlert() // should trigger foo's guard
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(2) a')
      .acceptAlert()
      .waitFor(100)
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')
      .click('button')
      .assert.containsText('.view', 'baz (saved)')
      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

      // test initial visit
    .url('http://localhost:8080/navigation-guards/foo')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      // redirects to root by default
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

    .url('http://localhost:8080/navigation-guards/foo')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

    .url('http://localhost:8080/navigation-guards/bar')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      // redirects to root by default
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

    .url('http://localhost:8080/navigation-guards/bar')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/bar')
      .assert.containsText('.view', 'bar')
      .end()
  }
}
