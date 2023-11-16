import { message } from 'antd/lib';

export const beforeUpload = (file: any): boolean => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  return isJpgOrPng && isLt2M;
};

export const handlePictureUpload = (file: string | Blob): FormData => {
  const data = new FormData();
  data.append('file', file);

  return data;
};
