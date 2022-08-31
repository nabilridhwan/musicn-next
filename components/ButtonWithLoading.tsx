import LoadingSpinner from './LoadingSpinner';

type ButtonWithLoadingProps = {
	isLoading: boolean;
	text: string;
    disabled: boolean;
};

const ButtonWithLoading = ({ isLoading, text, disabled }: ButtonWithLoadingProps) => {
	return (
		<button className={`btn btn-primary btn-full`} disabled={disabled ? disabled || isLoading : isLoading}>
			{isLoading ? (
				<LoadingSpinner color="black" width={15} height={15} />
			) : (
				text
			)}
		</button>
	);
};

export default ButtonWithLoading;
