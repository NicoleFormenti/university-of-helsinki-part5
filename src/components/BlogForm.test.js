import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('correct data is registered by event handler when new blog created', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    const form = component.container.querySelector('form')

    fireEvent.change(title, {
        target: { value: 'Testing' }
    })

    fireEvent.change(author, {
        target: { value: 'Nicole' }
    })

    fireEvent.change(url, {
        target: { value: 'http://www.nick.com' }
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing')
    expect(createBlog.mock.calls[0][0].author).toBe('Nicole')
    expect(createBlog.mock.calls[0][0].url).toBe('http://www.nick.com')
})