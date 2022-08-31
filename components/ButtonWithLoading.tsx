import LoadingSpinner from './LoadingSpinner';

type ButtonWithLoadingProps = {
	isLoading: boolean;
	text: string;
	disabled: boolean;
	'data-test-id'?: string;
};

const ButtonWithLoading = ({
	isLoading,
	text,
	disabled,
	'data-test-id': dataTestId,
}: ButtonWithLoadingProps) => {
	return (
		<button
			data-test-id={dataTestId}
			className={`btn btn-primary btn-full`}
			disabled={disabled ? disabled || isLoading : isLoading}
		>
			{isLoading ? (
				<LoadingSpinner color="black" width={15} height={15} />
			) : (
				text
			)}
		</button>
	);
};

export default ButtonWithLoading;
