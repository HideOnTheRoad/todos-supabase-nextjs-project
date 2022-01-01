import React from "react";

interface Props {}

const Layout: React.FunctionComponent<Props> = ({ children }) => (
	<div className="flex w-full h-full bg-gray-100 justify-center  items-center">
		<div className="w-full h-full flex justify-center flex-col items-center p-4 max-w-2xl">
			{children}
		</div>
	</div>
);

export default Layout;
