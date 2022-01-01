import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Props {
	user: any;
}

interface ITodo {
	id: number;
	inserted_at: string;
	is_complete: boolean;
	task: string;
	user_id: string;
}

interface ITodoComp {
	todo: ITodo;
	onDelete: (id: number) => void;
}

const Todos: React.FunctionComponent<Props> = ({ user }) => {
	const [todos, setTodos] = useState<ITodo[]>([]);
	const [newTaskText, setNewTaskText] = useState("");

	const fetchTodos = async () => {
		let { data: todos, error } = await supabase.from("todos").select("*");

		const newTodos = todos as ITodo[];

		setTodos(newTodos);
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const deleteTodo = async (id: number) => {
		try {
			await supabase.from("todos").delete().eq("id", id);
			if (todos) {
				setTodos(todos.filter((x) => x.id != id));
			}
		} catch (error) {
			console.log("error", error);
		}
	};

	const addTodo = async (todoText: string) => {
		let task = todoText.trim();
		if (task.length) {
			let { data: todo, error } = await supabase
				.from("todos")
				.insert({ task, user_id: user.id })
				.single();
			if (error) {
			} else setTodos([...todos, todo]);
		}
	};
	const logout = async () => {
		let { error } = await supabase.auth.signOut();
	};

	return (
		<div className="flex justify-center flex-col w-full">
			<h1 className="mb-12">Todo List.</h1>
			<div className="flex gap-2 my-2">
				<input
					className="rounded w-full p-2"
					type="text"
					placeholder="Todo"
					value={newTaskText}
					onChange={(event) => {
						console.log(
							"event.target.value :>> ",
							event.target.value
						);
						setNewTaskText(event.target.value);
					}}
				/>
				<button
					className="btn-black"
					onClick={() => addTodo(newTaskText)}
				>
					Add
				</button>
			</div>
			<div className="bg-white shadow overflow-hidden rounded-md w-full">
				<ul>
					{todos?.map((todo) => {
						return (
							<Todo
								key={todo.id}
								todo={todo}
								onDelete={deleteTodo}
							/>
						);
					})}
				</ul>
			</div>
			<button
				className="btn-black mt-12 justify-self-center grow-0"
				onClick={logout}
			>
				Logout
			</button>
		</div>
	);
};

const Todo: React.FunctionComponent<ITodoComp> = ({ todo, onDelete }) => {
	const [isCompleted, setIsCompleted] = useState(todo.is_complete);

	const toggle = async () => {
		try {
			const { data, error } = await supabase
				.from("todos")
				.update({ is_complete: !isCompleted })
				.eq("id", todo.id)
				.single();
			if (error) {
				//	throw new Error(error);
			}
			setIsCompleted(data.is_complete);
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<li
			onClick={(e) => {
				e.preventDefault();
				toggle();
			}}
			className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
		>
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="min-w-0 flex-1 flex items-center">
					<div className="text-sm leading-5 font-medium truncate">
						{todo.task}
					</div>
				</div>
				<div>
					<input
						className="cursor-pointer"
						onChange={(e) => toggle()}
						type="checkbox"
						checked={isCompleted ? true : false}
					/>
				</div>
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onDelete(todo.id);
					}}
					className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="gray"
					>
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</li>
	);
};

export default Todos;
