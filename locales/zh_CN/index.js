const zh_CN = {
    language_name: "简体中文",
  
    // Menu
    sub_title: "简洁、快速、安全的用户端文件加密", // simple, fast, secure client-side file encryption
    home: "主页", // home
    about: "关于",
  
    // About page menu
    introduction: "介绍", // Introduction
    features: "特点", // Features
    installation: "安装", // Installation
    usage: "使用", // Usage
    limitations: "限制", // Limitations
    best_practices: "最佳实践", // Best-Practices
    faq: "问与答", // FAQ
    technical_details: "技术细节", // Technical-Details
    changelog: "更新日志", // Changelog
    donation_message: "喜欢 hat.sh 吗？您可以捐赠来支持本项目", // Love hat.sh? You can donate to support the project.
  
    // Settings
    settings: "设置", // Settings
    language: "语言", // Language
    change_language: "更改显示语言", // Change display language
    change_appearance: "改变外观", // Change appearance
    language_changed: "语言已经更改！ 刷新页面生效", // Language changed! - Page reload is needed to take effect.
    help_translate: "没有您的语言？您可以根据 Github 上的引导来帮助翻译本应用", // Can't find your language? you can help translate this app by following the translation guide on github.
    reload: "刷新", // RELOAD
    dark_mode: "黑夜模式", // Dark Mode
    close: "关闭", // Close
    reset: "重置", // Reset
    guide: "引导", // Guide
    multiple_tabs_alert: "重复打开提醒", // Multiple tabs alert
    multiple_tabs_alert_notice_one: "Hat.sh 已经在另一标签窗口打开", // Looks like that Hat.sh is already open in another window/tab.
    multiple_tabs_alert_notice_two: "避免不同标签页在同一时间进行加密解密", // Please avoid encrypting/decrypting files in different tabs at the same time.
    understand: "明白！", // I UNDERSTAND

    // Common
    file: "文件", // file
    files: "文件", // files
    password: "密码", // Password
    public_key: "公钥", // Public key
    private_key: "私钥", // Private key
    drag_drop: "拖拽或浏览选择文件", // Drag & Drop or Browse file
    drag_drop_files: "拖拽或浏览选择文件", // Drag & Drop or Browse files
    browse_file: "浏览选择文件", // Browse File
    browse_files: "浏览选择文件", // Browse Files
    change_file: "更换文件", // Change File
    add_files: "添加文件", // Add Files
    next: "下一步", // Next
    back: "上一步", // Back
    error: "错误", // Error
    required: "必填项", // Required
    success: "成功", // Success
    show_password: "显示密码", // Show Password
    copy_password: "复制密码", // Copy Password
    password_copied: "密码已复制！", // Password copied!
    show_private_key: "显示私钥", // Show Private Key
    load_public_key: "载入本地公钥", // Load Public Key
    load_private_key: "载入本地私钥", // Load Private Key
    short_password: "密码最短为 12 字符，或者您可以随机生成一个", // Please enter a password with a minimum length of 12 characters. Or generate one.
    wrong_public_key: "错误的公钥", // Wrong Public Key
    wrong_private_key: "错误的私钥", // Wrong Private Key
    invalid_keys_input: "无效的密钥", // Invalid keys input.
    invalid_key_pair: "密钥无效！公钥和私钥不能为同一对", // This key pair is invalid! Please select keys for different parties.
    ready_to_download: "操作成功，等待下载！", // was loaded successfully and ready to download!
    files_ready_to_download: "操作成功，等待下载！", // files were loaded successfully and ready to download!
    downloading_file: "下载中", // Downloading...
    checking_file: "检查文件中", // Checking file...
    page_close_alert: "下载文件中，请勿关闭页面！", // Don't close the page while files are downloading!
    offline_note: "文件不会上传服务器，所有操作都在您的浏览器离线运行", // Files are not uploaded to a server, everything is done offline in your browser.

    // Password Strength Check
    very_weak: "非常弱", // Very Weak (guessable)
    weak: "弱", // Weak (guessable)
    moderate: "中等", // Moderate
    good: "好", // Good
    strong: "强", // Strong
    crackTimeEstimation: "破解需要：", // crack time estimation:
    less_second: "不到一秒", // less than a second
    seconds: "数秒", // seconds
    minutes: "数分钟", // minutes
    hours: "数小时", // hours
    days: "数天", // days
    months: "数月", // months
    years: "数年", // years
    centuries: "数世纪", // centuries

    // Encryption
    encryption: "加密", // Encryption
    drop_file_enc: "拽到这里来加密", // Drop files to encrypt
    choose_files_enc: "选择需要加密的文件",
    enter_password_enc: "输入密码",
    enter_keys_enc: "输入接收者的公钥和你的私钥", // Enter recipient's Public key and your Private Key
    password_strength: "密码强度", // Password strength
    choose_strong_password: "输入一个强密码", // Choose a strong Password
    generate_password: "生成随机密码", // Generate Password
    recipient_public_key: "接收者的公钥", // Recipient's Public Key
    enter_recipient_public_key: "输入接收者的公钥", // Enter recipient's public key
    your_private_key_enc: "你的私钥", // Your Private Key
    enter_private_key_enc: "输入你的私钥", // Enter your private key
    encrypted_files: "加密后的文件", // Encrypted Files
    download_encrypted_files: "下载加密后的文件", // Download encrypted files
    success_downloaded_files_enc: "已成功下载加密后的文件", // You have successfully downloaded the encrypted files!
    encrypt_more_files: "加密更多文件", // Encrypt More Files
    create_shareable_link: "创建分享链接", // Create shareable link
    create_shareable_link_tooltip: "创建一个包含有您公钥的链接", // Create a link that has your public key
    create_shareable_link_note: "此链接离线生成", // This link was generated offline.
    create_shareable_link_copied: "公钥分享链接已复制！", // Shareable link copied!
    copy_link: "复制链接", // Copy link
    after_enc_note_one: "分享时必须告诉接收者您的公钥，这样他才能解密", // You must share this file along with your public key in order for the recipient to decrypt it.
    after_enc_note_two: "您可以创建一个包含有您公钥的链接，这样接收者不用单独接收、手动输入您的公钥", // You can create a link that has your public key so you do not have to send your public key and worry about the recipient entering it.
    testing_password: "测试密码中", // Testing Password...
    testing_keys: "测试密钥中", // Testing Keys...
  
    // Decrypion
    decryption: "解密", // Decryption
    drop_file_dec: "拽到这里来解密", // Drop files to decrypt
    choose_files_dec: "选择需要解密的文件", // Choose files to decrypt
    sender_key_loaded: "发送者公钥已载入，请选择需要解密的文件", // Sender's public key is loaded, please select the encrypted file.
    recipient_key_loaded: "接收者公钥已载入，请选择需要需要加密的文件", // Recipient's public key is loaded, please select a file to encrypt.
    file_not_encrypted_corrupted: "该文件不是使用 hat.sh 加密的，或者文件已损坏！", // This file was not encrypted using hat.sh or the file may be corrupted!
    old_version: "文件由老版本 hat.sh 加密，访问 v1 版本来解密", // This file was encrypted using an older version of hat.sh, you can decrypt this file by visiting the v1 app.
    file_mixup: "“解铃还需系铃人”，文件的加密解密方法必须保持一致，请选择相匹配的文件", // Files selected for decryption have to be encrypted using the same method, either by password or public key. Choose files that match.
    enter_password_dec: "输入解密密码", // Enter the decryption password
    enter_keys_dec: "输入发送者的公钥和您的私钥", // Enter sender's Public key and your Private Key
    wrong_password: "密码错误", // Wrong Password
    file_has_wrong_password: "存在错误的密码，密码测试中止，确保当前的所有文件需要同样的的正确的密码", // has a wrong password, password testing stopped, make sure all files have the same correct decryption password.
    file_has_wrong_keys: "存在错误的密钥，密钥测试中止，确保当前的所有文件需要同样的正确的密钥", // has wrong keys, keys testing stopped, make sure all files have the same correct decryption keys.
    sender_public_key: "发送者的公钥", // Sender's Public Key
    enter_sender_public_key: "输入发送者的公钥", // Enter sender's public key
    your_private_key_dec: "你的私钥", // Your Private Key
    enter_private_key_dec: "输入你的私钥", // Enter your private key
    decrypted_files: "解密后的文件", // Decrypted Files
    download_decrypted_files: "下载解密后的文件", // Download decrypted files
    success_downloaded_files_dec: "您已成功下载解密后的文件", // You have successfully downloaded the decrypted files!
    decrypt_other_files: "解密其他文件", // Decrypt Other Files
  
    // Limited
    choose_file_enc: "选择一个需要加密的文件", // Choose a file to encrypt
    choose_file_dec: "选择一个需要解密的文件", // Choose a file to decrypt
    encrypted_file: "加密后的文件", // Encrypted File
    decrypted_file: "解密后的文件", // Decrypted File
    download_encrypted_file: "下载加密后的文件", // Download encrypted file
    download_decrypted_file: "下载解密后的文件", // Download decrypted file
    success_downloaded_file_enc: "您已成功下载加密后的文件", // You have successfully downloaded the encrypted file!
    success_downloaded_file_dec: "您已成功下载解密后的文件", // You have successfully downloaded the decrypted file!
    encrypt_another_file: "加密其他文件", // Encrypt Another File
    decrypt_another_file: "解密其他文件", // Decrypt Another File
    limited_safari: "Safari 浏览器限制：单文件，最大 1G", // Safari browsers have limited experience (single file, 1GB)
    limited_mobile: "手机浏览器限制：单文件，最大 1G", // Mobile browsers have limited experience (single file, 1GB)
    limited_private: "隐私浏览限制：单文件，最大 1G", // You have limited experience (single file, 1GB) due to Private browsing.
    file_too_big: "文件太大！", // File is too big!
    choose_file_1gb: "文件最大为 1G ", // Choose a file up to 1GB.
    encrypt_file: "加密文件", // Encrypt file
    encrypting_file: "加密中", // Encrypting...
    decrypting_file: "解密中", // Decrypting...
    page_close_alert_enc: "文件加密中，请勿关闭", // Don't close the page while the file is encrypting!
    success_encrypted: "文件已成功加密！", // The file was successfully encrypted!
    page_close_alert_dec: "文件解密中，请勿关闭", // Don't close the page while the file is decrypting!
    success_decrypted: "文件已成功解密！", // The file was successfully decrypted!
    download_file: "下载文件", // Download File
  
    // Keypair generation panel
    generate_now_button: "现在生成", // Generate now
    generate_key_pair_button: "生成随即密钥对", // Generate Key Pair
    generate_another_key_pair_button: "生成其他密钥对", // Generate Another Pair
    key_pair_question: "没有密钥吗？", // Don't have public/private keys?
    key_pair_generation_title: "公私密钥对生成：", // Public/Private key pair generation:
    download_public_key: "下载公钥", // Download Public Key
    download_private_key: "下载私钥", // Download Private Key
    generate_public_key: "生成公钥", // Generate public key
    generate_private_key: "生成私钥", // Generate private key
    show_private_key: "显示私钥", // Show Private Key
    why_need_private_key: "为什么需要我的私钥？", // Why need my private key?
    private_key_notice: "绝对不要把您的私钥告诉任何人！只有公钥需要交换", // Never share your private key to anyone! Only public keys should be exchanged.
    generate_qr_code: "显示二维码", // Generate QR code
    qr_code_note_one: "二维码包含您的公钥，扫描后，设备会跳转到本应用并自动填充公钥", // This QR code contains your public key. After scanning, the device will redirect to the app and autofills the public key.
    qr_code_note_two: "将二维码或者公钥链接分享给其他人，这样他们在加密时不用手动输入您的公钥", // You can share this QR code or link with others, instead of them having to manually enter your public key when encrypting files.
    qr_code_note_three: "二维码为离线生成", // This QR code was generated offline.
    
  };
  
  export default zh_CN; // zh-CN