const card = post => {
    return `
        <div class="card z-depth-4">
            <div class="card-content">
                <span class="card-title">${post.title}</span>
                <p style="white-space: pre-line;">${post.text}</p>
                <small>${new Date(post.date).toLocaleDateString()}</small>
            </div>
            <div class="card-action">
                <button class="btn btn-small red js-remove" data-id="${post._id}">
                    <i class="material-icons js-remove">delete</i>
                </button>
            </div>
        </div>
    `
}

let posts = []
let BASE_URL = '/api/post'
let modal

class PostAPI {
    static fetch() {
        return fetch(BASE_URL, { method: 'get' }).then(data => data.json())
    }

    static create(post) {
        return fetch(BASE_URL, {
            method: 'post',
            body: JSON.stringify(post),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(data => data.json())
    }

    static delete(id) {
        return fetch(`${BASE_URL}/${id}`, {
            method: 'delete',
        }).then(data => data.json())
    }

}
document.addEventListener('DOMContentLoaded', () => {
    PostAPI.fetch().then(backendPosts => {
        posts = backendPosts.concat()
        renderPosts(posts)
    })
    modal = M.Modal.init(document.querySelector('.modal'))
    document.querySelector("#createPost").addEventListener("click", onCreatePost)
    document.querySelector("#posts").addEventListener("click", onDeletePost)
})

function renderPosts(_posts = []) {
    const $posts = document.querySelector('#posts')
    if (_posts.length > 0) {
        $posts.innerHTML = _posts.map(item => card(item)).join(" ")
    } else {
        $posts.innerHTML = `<div class="center"><h2> At the time there is no posts</h2></div>`
    }
}

function onCreatePost() {
    const title = document.querySelector("#title").value
    const text = document.querySelector("#text").value

    if (title && text) {
        const fields = {
            title,
            text
        }
        PostAPI.create(fields).then(data => {
            posts.push(data)
            renderPosts(posts)
        })
        modal.close()
        title = ''
        text = ''
        M.updateTextFields()
    }
}

function onDeletePost(event) {
    if (event.target.classList.contains('js-remove')) {
        const decision = confirm("Do you went delete post?")
        if (decision) {
            const id = event.target.getAttribute('data-id')
            PostAPI.delete(id).then(() => {
                const postIndex = posts.some(post => post._id === id)
                posts.splice(postIndex, 1)
                renderPosts(posts)
            })
        }
    }
}