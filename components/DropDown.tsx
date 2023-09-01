import React, {useState} from "react";

const DropDown: React.FC<{dropDownMenu, dropDownButton}> = ({dropDownMenu, dropDownButton}) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleToggle = () => setIsOpen(!isOpen);

	return (
		<div className="">
			<button onClick={handleToggle} className="focus:outline-none">
				{dropDownButton}
			</button>
			{ isOpen && (
				<div className="absolute right-[2rem] mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
					{dropDownMenu}
				</div>
			)}
		</div>
	)
}

export default DropDown;