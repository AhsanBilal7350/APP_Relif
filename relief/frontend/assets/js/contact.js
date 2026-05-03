function toggleFaq(id) {
            const ans = document.getElementById('faq-' + id);
            ans.style.display = (ans.style.display === 'block') ? 'none' : 'block';
        }