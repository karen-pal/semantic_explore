import os
import cv2
from tqdm import tqdm

# Function to extract frames from a video
def extract_frames(video_file, output_dir):
    # Open the video file
    cap = cv2.VideoCapture(video_file)

    if not cap.isOpened():
        print(f"Error: Could not open video file '{video_file}'")
        return

    # Get video properties
    frame_width = int(cap.get(3) / 2)  # Half the original width
    frame_height = int(cap.get(4) / 2)  # Half the original height
    frame_count = int(cap.get(7))  # Total number of frames

    # Create the output directory
    os.makedirs(output_dir, exist_ok=True)

    # Use tqdm for progress bar
    with tqdm(total=frame_count) as pbar:
        # Loop through frames
        for frame_number in range(frame_count):
            ret, frame = cap.read()
            if not ret:
                break

            # Resize the frame to half the original resolution
            frame = cv2.resize(frame, (frame_width, frame_height))

            # Save the frame as a PNG file
            frame_filename = os.path.join(output_dir, f"{frame_number:04}.png")
            cv2.imwrite(frame_filename, frame)

            pbar.update(1)

    # Release the video capture object
    cap.release()

# Directory containing video files
video_directory = "clips"

# Process each video in the directory
for video_file in os.listdir(video_directory):
    if video_file.endswith((".mp4", ".avi")):  # Add more video file extensions as needed
        video_path = os.path.join(video_directory, video_file)
        output_subdirectory = os.path.splitext(video_file)[0] + "_frames"
        output_dir = os.path.join(video_directory, output_subdirectory)
        extract_frames(video_path, output_dir)

print("Frames extraction completed.")

