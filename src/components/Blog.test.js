import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes', () => {
    const blog = {
        title: 'This is a test',
        author: 'Nicole Formenti-Pedroia',
        likes: 1,
        url: 'http://www.nick.com',
        user: {
            name: 'userone'
        }
    }

    const component = render(
        <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent('This is a test')
    expect(component.container).toHaveTextContent('Nicole Formenti-Pedroia')
    expect(component.container).not.toHaveTextContent('1')
    expect(component.container).not.toHaveTextContent('http://www.nick.com')
})

test('renders url and likes when "view" button is clicked', () => {
    const blog = {
        title: 'This is a test',
        author: 'Nicole Formenti-Pedroia',
        likes: 1,
        url: 'http://www.nick.com',
        user: {
            name: 'userone'
        }
    }

    const component = render(
        <Blog blog={blog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('1')
    expect(component.container).toHaveTextContent('http://www.nick.com')
})

test('"increaseLikes" called twice if "like" button clicked twice', () => {
    const blog = {
        title: 'This is a test',
        author: 'Nicole Formenti-Pedroia',
        likes: 1,
        url: 'http://www.nick.com',
        user: {
            name: 'userone'
        }
    }

    const increaseLikes = jest.fn()

    const component = render(
        <Blog blog={blog} increaseLikes={increaseLikes} />
    )

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(increaseLikes.mock.calls).toHaveLength(2)
})