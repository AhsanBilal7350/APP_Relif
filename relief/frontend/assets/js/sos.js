document.addEventListener('DOMContentLoaded', async () => {
            try {
                const response = await fetch('/api/emergency');
                if (response.ok) {
                    const data = await response.json();
                    const helplineContainer = document.querySelector('.helpline-info');
                    helplineContainer.innerHTML = '';
                    
                    data.helplines.forEach(helpline => {
                        const p = document.createElement('p');
                        p.textContent = `${helpline.name}: ${helpline.number}`;
                        helplineContainer.appendChild(p);
                    });
                    
                    const pSafety = document.createElement('p');
                    pSafety.textContent = 'Available 24/7 for your safety';
                    helplineContainer.appendChild(pSafety);
                    
                    // Update main call button to first number
                    if (data.helplines.length > 0) {
                        const mainNum = document.querySelector('.emergency-num');
                        const btnCall = document.querySelector('.btn-call');
                        mainNum.textContent = data.helplines[0].number;
                        btnCall.href = `tel:${data.helplines[0].number.replace(/-/g, '')}`;
                    }
                }
            } catch (err) {
                console.error("Failed to load emergency numbers:", err);
            }
        });