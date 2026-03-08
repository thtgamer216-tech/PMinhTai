from flask import Flask, render_template

app = Flask(__name__)

# Route chính dẫn vào trang chủ
@app.route('/')
def index():
    # Flask sẽ tự tìm file mainchinh.html trong thư mục templates
    return render_template('mainchinh.html')

if __name__ == '__main__':
    # Chạy server ở cổng 5000 và bật chế độ debug để tự cập nhật khi sửa code
    app.run(debug=True, port=5000)