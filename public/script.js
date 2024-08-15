// Sample data for initial posts (can be replaced with database data)
let posts = [
    { cropName: 'Apples', quantity: 50, price: 2.5 },
    { cropName: 'Oranges', quantity: 30, price: 3 },
    { cropName: 'Bananas', quantity: 40, price: 2 }
];

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
        <p><strong>Crop Name:</strong> ${post.cropName}</p>
        <p><strong>Quantity:</strong> ${post.quantity}</p>
        <p><strong>Price:</strong> $${post.price.toFixed(2)}</p>
        <a href="/market/buy" ><button onclick="buy(${index})" class="buyBtn">Buy</button></a>
      `;
        postsContainer.appendChild(postElement);
    });
}

// Function to add a new post
function addPost() {
    const cropName = document.getElementById('cropName').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    if (cropName && quantity && price) {
        const newPost = { cropName, quantity, price };
        posts.push(newPost);
        displayPosts();
        // Clear input fields after adding a post
        document.getElementById('cropName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
    } else {
        alert('Please fill in all fields');
    }
}

// Function to handle buying a post
function buy(index) {
    const post = posts[index];
    // alert(You bought ${post.quantity} ${post.cropName} for $${post.price.toFixed(2)});
    // Here you can implement further logic for handling the purchase
}

// Display initial posts
displayPosts();