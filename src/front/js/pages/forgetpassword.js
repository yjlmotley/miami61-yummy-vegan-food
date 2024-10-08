import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

export const Forgetpassword = () => {
	const [hastoken, setHastoken] = useState(false)
	const [email, setEmail] = useState('')
	const [error, setErrMsg] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const { token } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		if (token) {
			setHastoken(true)
		}
	}, [token])

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function validateEmail(email) {
		return emailRegex.test(email);
	}

	const handleEmailChange = (event) => {
		const enteredEmail = event.target.value;
		setEmail(enteredEmail);
		if (validateEmail(enteredEmail)) {
			setErrMsg("");
		}
	};

	async function handleSubmit(event) {
		event.preventDefault();
		if (!hastoken) {
			if (!validateEmail(email)) {
				setErrMsg("Please try a valid email.");
				return;
			}
			fetch(process.env.BACKEND_URL + "/api/forget_password", {
				method: "POST",
				headers: { 'Content-Type': "application/json" },
				body: JSON.stringify({
					email: email.toLowerCase(),
					// password: password
				})
			}).then(response => {
				if (response.status === 200) {
					console.log("email sent to reset password")
					console.log("response", response.message)
					alert("An email has been sent to reset your password.")
					setTimeout(() => navigate('/login'), 30 * 1000);
				} else if (response.status === 400) {
					return response.json().then(data => {
						throw new Error(data.message || "Incorrect email or password");
					});
				} else {
					throw new Error("Something went wrong with the server.");
				}
			}).catch(error => {
				setErrMsg(error.message);
			});
		} else {
			if (password === confirmPassword) {
				fetch(process.env.BACKEND_URL + "/api/change_password", {
					method: "PUT",
					headers: { 'Content-Type': "application/json" },
					body: JSON.stringify({
						// email: email,
						password: password,
						secret: token
					})
				}).then(response => {
					if (response.status === 200) {
						console.log("response", response.message)
						navigate('/login')
					} else if (response.status === 400) {
						return response.json().then(data => {
							throw new Error(data.message || "Password is not provided");
						});
					} else {
						throw new Error("Something went wrong with the server.");
					}
				}).catch(error => {
					setErrMsg(error.message);
				});
			}
		}
	}
	return (
		<div className="container mt-4">
			<form onSubmit={handleSubmit}>
				{!hastoken &&
					<div className="mb-3">
						<h1>Reset Password</h1>
						<label className="form-label" htmlFor="email">email</label>
						<input onChange={handleEmailChange} className="form-control" id="email" placeholder="email" />
					</div>
				}
				{hastoken &&
					<div>
						<h1>Reset Password</h1>
						<div className="mb-3">
							<label className="form-label" htmlFor="password">New Password</label>
							<input onChange={(e) => {
								setPassword(e.target.value)
							}} className="form-control" id="password" type="password" placeholder="new password" />
						</div>
						<div className="mb-3">
							<label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
							<input onChange={(e) => {
								setConfirmPassword(e.target.value)
							}} className="form-control" id="confirm_password" type="password" placeholder="please confirm your new password" />
						</div>
					</div>
				}
				<div className="col-auto">
					{error && error.length && <div className="alert alert-danger" role="alert">{error}</div>}
					<button type="submit" className="btn submitbtn mb-3">Submit</button>
				</div>
			</form>
		</div>
	);
};
