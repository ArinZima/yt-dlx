use std::io::{ self, Write };
use std::process::{ Command, Stdio };

#[cfg(target_os = "windows")]
const CLEAR_COMMAND: &str = "cls";
#[cfg(not(target_os = "windows"))]
const CLEAR_COMMAND: &str = "clear";

fn main() {
    Command::new(CLEAR_COMMAND).status().expect("Failed to clear screen");
    println!("Choose an option:");
    println!("1: python3 core/hyperband/guwahati_train.py");
    println!("2: python3 core/randomsearch/guwahati_train.py");
    println!("3: python3 core/randomsearch/general_train.py");
    println!("4: python3 core/wqi.py");
    print!("< Enter your choice />\n:");
    io::stdout().flush().unwrap();
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let choice: u32 = input.trim().parse().unwrap();
    match choice {
        1 => run_command("python3", &["core/hyperband/guwahati_train.py"]),
        2 => run_command("python3", &["core/randomsearch/guwahati_train.py"]),
        3 => run_command("python3", &["core/randomsearch/general_train.py"]),
        4 => run_command("python3", &["core/wqi.py"]),
        _ => println!("Invalid choice!"),
    }
}

fn run_command(command: &str, args: &[&str]) {
    let mut child = Command::new(command)
        .args(args)
        .stdout(Stdio::piped())
        .spawn()
        .expect("Failed to execute command");
    let stdout = child.stdout.take().unwrap();
    std::thread::spawn(move || {
        std::io
            ::copy(&mut std::io::BufReader::new(stdout), &mut std::io::stdout())
            .expect("Failed to redirect stdout");
    });
    let status = child.wait().expect("Failed to wait for command");
    if !status.success() {
        eprintln!("Command failed with exit code: {}", status);
    }
}
