const API_BASE = 'http://localhost/mycampus-cafe-slim-api/public/api'; 

const app = Vue.createApp({ 
    data() { 
        return { 
            menuItems: [], 
            message: "", 
            isLoggedIn: !!getToken(), 
            login: { 
                username: "", 
                password: "" 
            }, 
            isEditMode: false,  
            editingId: null, 
            newMenu: { 
                menu_name: "", 
                category: "", 
                price: "", 
                availability: "Available" 
            } 
        }; 
    }, 

    methods: { 
        async loginStaff() { 
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/login", { 
                    method: "POST", 
                    headers: publicHeaders(), 
                    body: JSON.stringify({ 
                        username: this.login.username, 
                        password: this.login.password 
                    }) 
                }); 
        
                const result = await response.json(); 
        
                if (response.ok && result.token) { 
                    setToken(result.token); 
                    this.isLoggedIn = true; 
                    this.message = "Login successful."; 
                } else { 
                    this.message = result.message || "Invalid login."; 
                } 
            } catch (error) { 
                this.message = "Unable to connect to server."; 
                console.error(error); 
            } 
        },

        // GET Request
        async fetchMenu() { 
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/menu"); 
                this.menuItems = await response.json(); 
            } catch (error) { 
                this.message = "Failed to load menu data."; 
                console.error(error); 
            } 
        },

        // Handles form dynamic branching
        handleSubmit() {
            if (this.isEditMode) {
                this.updateMenu();
            } else {
                this.addMenu();
            }
        },

        // POST Request
        async addMenu() { 
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/menu", { 
                    method: "POST", 
                    headers: authHeaders(), 
                    body: JSON.stringify(this.newMenu) 
                });
                 const result = await response.json(); 
  
                if (response.ok) { 
                    this.message = "Menu item added successfully."; 
                    this.newMenu = { 
                        menu_name: "", 
                        category: "", 
                        price: "", 
                        availability: "Available" 
                    }; 
                    this.fetchMenu(); 
                } else { 
                    this.message = result.message || "Add menu failed."; 
                } 
            } catch (error) { 
                this.message = "Server connection error."; 
                console.error(error); 
            } 
        },

        // Prepare form when clicking "Edit"
        editMenu(item) { 
            this.isEditMode = true; 
            this.editingId = item.menu_id;
            this.newMenu = { 
                menu_name: item.menu_name, 
                category: item.category, 
                price: item.price, 
                availability: item.availability 
            }; 
        }, 

        // PUT Request
        async updateMenu() { 
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/menu/" + this.editingId, { 
                    method: "PUT", 
                    headers: authHeaders(), 
                    body: JSON.stringify(this.newMenu) 
                }); 
        
                const result = await response.json(); 
        
                if (response.ok) { 
                    this.message = "Menu item updated successfully."; 
                    this.fetchMenu(); 
                    this.cancelEdit();
                } else { 
                    this.message = result.message || "Update failed."; 
                } 
            } catch (error) { 
                this.message = "Unable to update menu."; 
                console.error(error); 
            } 
        },

        // DELETE Request                
        async deleteMenu(id) { 
            if (!confirm("Are you sure you want to delete this menu item?")) { 
                return; 
            } 
        
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/menu/" + id, { 
                    method: "DELETE", 
                    headers: authHeaders() 
                }); 
        
                const result = await response.json(); 
        
                if (response.ok) { 
                    this.message = "Menu item deleted successfully."; 
                    this.fetchMenu(); 
                } else { 
                    this.message = result.message || "Delete failed."; 
                } 
            } catch (error) { 
                this.message = "Unable to delete menu."; 
                console.error(error); 
            } 
        },

        // Cancels edit and resets form
        cancelEdit() {
            this.isEditMode = false;
            this.editingId = null;
            this.resetForm();
        },
        resetForm() {
            this.newMenu = { menu_name: '', category: '', price: '', availability: 'Available' }; 
        }
    }, 
    mounted() { 
        this.fetchMenu(); 
    } 
}); 
 
app.mount('#app');