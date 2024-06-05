"use client"

import { useState, useEffect, useCallback } from 'react'
import './admin.css'
import NavBar from "/src/app/components/Navbar";

const AdminPanel = () => {

    const [users, setUsers] = useState([])
    const [userToUpdate, setUserToUpdate] = useState([{}])

    const handleUserInputChange = (event, index, field) => {
        const newUserToUpdate = [...userToUpdate]
        newUserToUpdate[index][field] = event.target.value
        setUserToUpdate(newUserToUpdate)
    }

    //////////////////////////////////
    // Get all or one user(s)
    const getUsers = async(requestedUsers='all') => {
        console.log(requestedUsers);
        try {
            const response = await fetch('/api/users?requestedUsers='+requestedUsers, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            const data = await response.json()
            console.log(data.users);
            
            if (requestedUsers == 'all') {setUsers(data.users)}
            else {setUserToUpdate(data.users);}

        } catch (error) {
            console.error(error)
        }
    }

    //////////////////////////////////
    // Update user
    const updateUser = async(userToUpdate) => {
        console.log(userToUpdate);
        try {
            const response = await fetch(
                '/api/users',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'
                },
                body: JSON.stringify(userToUpdate)
            })
            const data = await response.json()
            console.log(data.user);
            window.location.href = '/client/admin'
        } catch (error) {
            console.error(error)
        }
    }

    //////////////////////////////////
    // Delete user
    const deleteUser = async(userIdToDelete) => {
        console.log(userIdToDelete);

        const confirm = window.confirm("Are you sure you want to delete this user?");

        if (confirm) {
            console.log("Deletion confirmed.");
        } else {
            console.log("Deletion canceled.");
            return -1
        }

        try {
            const response = await fetch(
                '/api/users',
                {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'
                },
                body: JSON.stringify(userIdToDelete)
            })
            const data = await response.json()
            console.log(data.user);
            window.location.href = '/client/admin'
        } catch (error) {
            console.error(error)
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //type: text|image response_type: text|mcq
    const [form, setForm] = useState({
        quiz_folder: 'New_Quiz',
        quiz_title: 'Quiz - new Quiz',
        question: 'What is...',
        question_number: 1,
        total_number: 10,
        type: 'text',
        api_path: 'https://',
        response_obj: '',
        imageUrl: 'https://',
        imageAlt: 'Loading...',
        show_clue: false,
        clue: 'Write a clue',
        clue_price: 1,
        response_type: 'text',
        xpPerGoodAnswer: 2,
        xpCostPerClue: 1,
        rerender_hack: 0
    })

    const [content, setContent] = useState(" ")

    /*
        const handleUserInputChange = (event, index, field) => {
        const newUserToUpdate = [...userToUpdate]
        newUserToUpdate[index][field] = event.target.value
        setUserToUpdate(newUserToUpdate)
    }*/

    const handleQuizInputChange = (event) => {

        console.log("==========================> ", event.target.name, event.target.value) //OK
        //console.log("RERENDER:", form.rerender_hack);
        console.log("TYPE OF:", typeof(event.target.name));
        const newForm = {...form, [event.target.name]: event.target.value}
        setForm(newForm)
    }

/*
    const forceFormUpdate = () => {
        setForm({
            ...form,
            "rerender_hack": form.rerender_hack + 1
        })
        console.log(form.rerender_hack)
    }
*/

    const handleQuizSubmit = () => {
            const newContent = `{\n\t"quiz_folder":"${form.quiz_folder}",\n\t"quiz_title": "${form.quiz_title}",\n\t"question": "${form.question}",\n\t"question_number": ${form.question_number},\n\t"total_number": ${form.total_number},\n\t"type": "${form.text}",\n\t"api_path": "${form.api_path}",\n\t"response_obj": "${form.response_obj}",\n\t"imageUrl": "${form.imageUrl}",\n\t"imageAlt": "${form.imageAlt}",\n\t"show_clue": ${form.show_clue},\n\t"clue": "${form.clue}",\n\t"clue_price": ${form.clue_price},\n\t"response_type": "${form.response_type}",\n\t"xpPerGoodAnswer": ${form.xpPerGoodAnswer},\n\t"xpCostPerClue": ${form.xpCostPerClue}\n}`

            setContent(newContent)
    }

    //////////////////////////////////
    // Write file
    const writeFile = async(quizFolder, fileName) => {

        const newContent = `{\n\t"quiz_folder":"${form.quiz_folder}",\n\t"quiz_title": "${form.quiz_title}",\n\t"question": "${form.question}",\n\t"question_number": ${form.question_number},\n\t"total_number": ${form.total_number},\n\t"type": "${form.text}",\n\t"api_path": "${form.api_path}",\n\t"response_obj": "${form.response_obj}",\n\t"imageUrl": "${form.imageUrl}",\n\t"imageAlt": "${form.imageAlt}",\n\t"show_clue": ${form.show_clue},\n\t"clue": "${form.clue}",\n\t"clue_price": ${form.clue_price},\n\t"response_type": "${form.response_type}",\n\t"xpPerGoodAnswer": ${form.xpPerGoodAnswer},\n\t"xpCostPerClue": ${form.xpCostPerClue}\n}`

        setContent(newContent)

        console.log("WRITE FILE:");
        console.log(content);
        const dataObj = {quizFolder: quizFolder.replaceAll(' ', '_'), fileName: fileName, content: newContent};
        try {
            const response = await fetch(
                '/api/write_file',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(dataObj)
                }
            )
            const data = await response.json()
            console.log(data.message);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUsers()
        console.log(form.rerender_hack)
    }, [form, content])

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <NavBar style={{width: "100%"}} />
            </div>
            <div>
                <div class="divh1" style={{backgroundColor: "orange"}}>
                    <h1>REGISTERED USERS</h1>
                </div>
                <br/>
                <div class="divh2" style={{backgroundColor: "purple"}}>
                    <h1>user list</h1>
                </div>
                <div class="divtable">
                    <table>
                        <thead>
                            <tr>
                                <th style={{borderTopLeftRadius: "10px"}}>id</th>
                                <th>is_admin</th>
                                <th>username</th>
                                <th>country</th>
                                <th>email</th>
                                <th>xp</th>
                                <th>is_premium</th>
                                <th>daily_count</th>
                                <th>renewed_at</th>
                                <th style={{width: "160px", borderTopRightRadius: "10px"}}>action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td style={index === users.length-1 ? {borderBottomLeftRadius: "10px"} : {}}>{user.id}</td>
                                <td>{user.is_admin}</td>
                                <td>{user.username}</td>
                                <td>{user.country}</td>
                                <td>{user.email}</td>
                                <td>{user.xp}</td>
                                <td>{user.is_premium}</td>
                                <td>{user.daily_count}</td>
                                <td>{user.renewed_at}</td>
                                <td style={index === users.length-1 ? {borderBottomRightRadius: "10px"} : {}}><button style={{backgroundColor: "green"}} onClick={() => {getUsers(user.id)}}>&nbsp;Modify&nbsp;</button>&nbsp;&nbsp;{user.is_admin === 0 ? (<>&nbsp;&nbsp;<button style={{backgroundColor: "red"}} onClick={() => {deleteUser(user.id)}}>&nbsp;Delete&nbsp;</button></>) : null}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div class="divh2" style={{backgroundColor: "purple"}}>
                    <h1>modify and update user</h1>
                </div>
                <div class="divtable">
                    <table>
                        <thead>
                            <tr>
                                <th style={{borderTopLeftRadius: "10px"}}>id</th>
                                <th>is_admin</th>
                                <th>username</th>
                                <th>country</th>
                                <th>email</th>
                                <th>xp</th>
                                <th>is_premium</th>
                                <th>daily_count</th>
                                <th>renewed_at</th>
                                <th style={{width: "160px", borderTopRightRadius: "10px"}}>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userToUpdate.map((utu, index) => (
                            <tr key={utu.id}>
                                <td style={{borderBottomLeftRadius: "10px"}}>{utu.id}</td>
                                <td><input style={{width: "75px"}} value={utu.is_admin} onChange={(event) => handleUserInputChange(event, index, 'is_admin')}></input></td>
                                <td><input style={{width: "75px"}} value={utu.username} onChange={(event) => handleUserInputChange(event, index, 'username')}></input></td>
                                <td><input style={{width: "120px"}} value={utu.country} onChange={(event) => handleUserInputChange(event, index, 'country')}></input></td>
                                <td><input style={{width: "150px"}} value={utu.email} onChange={(event) => handleUserInputChange(event, index, 'email')}></input></td>
                                <td><input style={{width: "100px"}} value={utu.xp} onChange={(event) => handleUserInputChange(event, index, 'xp')}></input></td>
                                <td><input style={{width: "80px"}} value={utu.is_premium} onChange={(event) => handleUserInputChange(event, index, 'is_premium')}></input></td>
                                <td><input style={{width: "80px"}} value={utu.daily_count} onChange={(event) => handleUserInputChange(event, index, 'daily_count')}></input></td>
                                <td><input style={{width: "125px"}} value={utu.renewed_at} onChange={(event) => handleUserInputChange(event, index, 'renewed_at')}></input></td>
                                <td style={{borderBottomRightRadius: "10px"}}><button style={{width: "80px", backgroundColor: "DarkCyan"}} onClick={() => {updateUser(userToUpdate)}}>&nbsp;Update&nbsp;</button></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br/>
                <div class="divh1" style={{backgroundColor: "orange"}}>
                    <h1>QUIZ MANAGEMENT</h1>
                </div>
                <br/>
                <div class="divh2" style={{backgroundColor: "purple"}}>
                    <h1>create custom quiz</h1>
                </div>
                <div  style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <form> {/*onSubmit={() => {handleQuizSubmit()}}>*/}
                        <table>
                            <tbody>
                            <tr>
                                <th>Quiz folder:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="quiz_folder"
                                    name="quiz_folder"
                                    value={form.quiz_folder}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Quiz title:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="quiz_title"
                                    name="quiz_title"
                                    value={form.quiz_title}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Question:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="question"
                                    name="question"
                                    value={form.question}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Question number:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="question_number"
                                    name="question_number"
                                    value={form.question_number}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Total number:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="total_number"
                                    name="total_number"
                                    value={form.total_number}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Type:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={form.type}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>External API request path:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="api_path"
                                    name="api_path"
                                    value={form.api_path}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Response object:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="response_obj"
                                    name="response_obj"
                                    value={form.response_obj}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Image URL:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Image alt:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="imageAlt"
                                    name="imageAlt"
                                    value={form.imageAlt}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Show clue:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="show_clue"
                                    name="show_clue"
                                    value={form.show_clue}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Clue:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="clue"
                                    name="clue"
                                    value={form.clue}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Clue price:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="clue_price"
                                    name="clue_price"
                                    value={form.clue_price}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>Response type:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="response_type"
                                    name="response_type"
                                    value={form.response_type}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>XP per good answer:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="xpPerGoodAnswer"
                                    name="xpPerGoodAnswer"
                                    value={form.xpPerGoodAnswer}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>

                            <tr>
                                <th>XP cost per clue:</th>
                                <td>
                                <input
                                    style={{width: "100%", paddingLeft: "7px"}}
                                    type="text"
                                    id="xpCostPerClue"
                                    name="xpCostPerClue"
                                    value={form.xpCostPerClue}
                                    onChange={handleQuizInputChange}
                                />
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <button style={{width: "80px", backgroundColor: "DarkCyan", float: "right"}} type="button" onClick={() => {writeFile(form.quiz_folder, "settings.json", content)}}>Submit</button>
                        </form>
                    </div>
                {/*<button style={{width: "80px", backgroundColor: "DarkCyan"}} onClick={() => {handleQuizSubmit(form.quiz_folder, "settings.json", content)}}>&nbsp;Write file&nbsp;</button>*/}
            </div>
        </>
    )
}

export default AdminPanel

// onChange={setUserToUpdate(...userToUpdate, id)}
