"use client"
import React, {useCallback, useEffect, useState} from 'react';
import {IUser} from "@/interface/user";
import AvatarEditForm from "@/app/user/edit/_components/avatarEditForm";
import useUserStore from "@/store/user";
import Nav from "@/components/nav";

const Page = () => {
	const store =  useUserStore()
	const [user, setUser] = useState(null as IUser | null )

	const fetchUserInfo = useCallback(  () =>{
		fetch(`http://localhost:5000/user/${store.user?.id}`)
			.then(async (res)=>{
				const data = await res.json()
				if (!res.ok){

					throw new Error(data.error || 'Failed to Fetch user info');
				}

				setUser(data.user)
			}).catch(error => console.log(error.message))
	}, [store.user?.id])

	useEffect(() => {
		fetchUserInfo()
	}, [store.user?.id, fetchUserInfo ]);
	return (
		<>
			<Nav/>
			<div className="flex justify-start">
				<AvatarEditForm user={user} className="flex min-h-screen flex-col justify-between p-24"/>
			</div>

		</>
	);
};


export default Page;