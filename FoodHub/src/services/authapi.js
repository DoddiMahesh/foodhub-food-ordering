const API_BASE_URL =  "http://localhost:8000/api/auth";

//CUSTOMER REGISTRATION
export const customerRegister = async(userData) => {
    const response = await fetch(
        `${API_BASE_URL}/customer/register/`,
        {
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(userData)
        }
    );


    const data = await response.json();
    if(!response.ok){
        let message = "Registration failed";
        if(data.detail){message=data.detail}
        else if(data.message){message=data.message}
        else if(typeof data==="object"){
            const errors=Object.values(data).flat();
            if(errors.length>0){message=errors.join(" ");}
        }
        throw new Error(message)
    }
    return data;
};

//CUSTOMER LOGIN
export const customerLogin = async(userData) => {
    const response=await fetch(
        `${API_BASE_URL}/customer/login/`,
        {
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(userData)
        }
    );

    const data=await response.json();
    if(!response.ok){
        let message="Login failed";
        if(data.detail){message=data.detail}
        else if(data.message){message=data.message}
        else if(typeof data==="object"){
            const errors=Object.values(data).flat();
            if(errors.length>0){message=errors.join(" ")}
        }
        throw new Error(message)
    }
    return data
};

//PARTNER REGISTRATION
export const partnerRegister = async(userData) => {
    const response = await fetch(
        `${API_BASE_URL}/partner/register/`,
        {
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(userData)
        }
    );


    const data = await response.json();
    if(!response.ok){
        let message = "Registration failed";
        if(data.detail){message=data.detail}
        else if(data.message){message=data.message}
        else if(typeof data==="object"){
            const errors=Object.values(data).flat();
            if(errors.length>0){message=errors.join(" ");}
        }
        throw new Error(message)
    }
    return data;
};

//PARTNER LOGIN
export const parentLogin = async(userData) => {
    const response=await fetch(
        `${API_BASE_URL}/partner/login/`,
        {
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include",
            body:JSON.stringify(userData)
        }
    );

    const data=await response.json();
    if(!response.ok){
        let message="Login failed";
        if(data.detail){message=data.detail}
        else if(data.message){message=data.message}
        else if(typeof data==="object"){
            const errors=Object.values(data).flat();
            if(errors.length>0){message=errors.join(" ")}
        }
        throw new Error(message)
    }
    return data
};

// Add Restaurant
export const addRestaurant=async(restaurantData)=>{
    const response=await fetch(
        `${API_BASE_URL}/partner/restaurant/add/`,
        {
            method:"POST",
            credentials:"include",
            body:restaurantData,
        }
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            Object.values(data).flat().join(" ") ||
            "Faile to add restaurant"
        )
    }
    return data
}
//Get MyRestaurants
export const getMyRestaurants=async()=>{
    const response=await fetch(
        `${API_BASE_URL}/partner/my-restaurants/`,
        {
            method:"GET",
            credentials:"include"
        }
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(data.error || "Faild to fetch restaurant")
    }
    return data
}

//Get Restaurant
export const getRestaurant=async(restaurantId)=>{
    const response=await fetch(
       `${API_BASE_URL}/partner/restaurant/${restaurantId}/`,
       {
        method:"GET",
        credentials:"include",
       } 
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            Object.values(data).flat().join(" ") ||
            "Faile to fech restaurant"
        )
    }
    return data
}

//Update Restaurant
export const updateRestaurant=async(restaurantId,restaurantData)=>{
    const response=await fetch(
       `${API_BASE_URL}/partner/restaurant/${restaurantId}/update/`,
       {
        method:"PUT",
        credentials:"include",
        body:restaurantData
       } 
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            Object.values(data).flat().join(" ") ||
            "Failed to update restaurant"
        )
    }
    return data
}

//Delete Restaurant
export const deleteRestaurant=async(restaurantId,restaurantData)=>{
    const response=await fetch(
       `${API_BASE_URL}/partner/restaurant/${restaurantId}/delete/`,
       {
        method:"DELETE",
        credentials:"include",
       } 
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            Object.values(data).flat().join(" ") ||
            "Failed to delete restaurant"
        )
    }
    return data
}
// Add Dish
export const addDish=async(dishData)=>{
    const response=await fetch(
        `${API_BASE_URL}/partner/dish/add/`,
        {
            method:"POST",
            credentials:"include",
            body:dishData,
        }
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            "Faile to add dish"
        )
    }
    return data
}
// Get Dish
export const getDish=async(dishId)=>{
    const response=await fetch(
        `${API_BASE_URL}/partner/dish/${dishId}/`,
        {
            method:"GET",
            credentials:"include",
        }
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            "Faile to get dush"
        )
    }
    return data
}
// Update Dish
export const updateDish=async(dishId,dishData)=>{
    const response=await fetch(
        `${API_BASE_URL}/partner/dish/${dishId}/edit/`,
        {
            method:"PATCH",
            credentials:"include",
            body:dishData,
        }
    )
    const data=await response.json()
    if(!response.ok){
        throw new Error(
            data.detail ||
            data.error ||
            "Faile to update dish"
        )
    }
    return data
}

// Delete Dish
export const deleteDish = async (dishId) => {
    const response = await fetch(
        `${API_BASE_URL}/partner/dish/${dishId}/delete/`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete dish");
    }

    return true;
};

//Get All Dishes
export const getDishes = async (restaurantId) => {

    const response = await fetch(
        `${API_BASE_URL}/partner/restaurant/${restaurantId}/dishes/`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get dishes");
    }

    return data;
};

export const getAllRestaurants = async () => {
    const response = await fetch(
        `${API_BASE_URL}/customer/restaurants/`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to fetch restaurants"
        );
    }

    return data;
};