import { useState, useEffect, useCallback } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export default function App() {
	const [imgUri, setImgUri] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const image = Asset.fromModule(require("./assets/favicon.png"));
			await image.downloadAsync();
			setImgUri(image.localUri);
		})();
	}, []);

	const rotateAndFlip = useCallback(async () => {
		try {
			if (!imgUri) return;

			const imgManipCtx = ImageManipulator.manipulate(imgUri);

			// console.log("img", imgManipCtx);

			const renderedImg = await imgManipCtx.rotate(90).flip("vertical").renderAsync();

			const manipResult = await renderedImg.saveAsync({
				compress: 1,
				format: SaveFormat.PNG,
			});

			setImgUri(manipResult.uri);
		} catch (error) {
			console.error(error);
		}
	}, [imgUri]);

	return (
		<View style={styles.container}>
			{imgUri ? (
				<View style={styles.imageContainer}>
					<Image source={{ uri: imgUri }} style={styles.image} />
				</View>
			) : null}
			<Button title="Rotate and Flip" onPress={rotateAndFlip} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	imageContainer: {
		marginVertical: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: 300,
		height: 300,
		resizeMode: "contain",
	},
});
