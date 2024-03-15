use std::io::{ self, Write };
use std::process::Command;

fn main() {
    println!("Choose an option:");
    println!("1 = python3 core/hyperband/guwahati_train.py");
    println!("2 = python3 core/randomsearch/guwahati_train.py");
    println!("3 = python3 core/randomsearch/general_train.py");
    println!("4 = python3 core/wqi.py");
    print!("Enter your choice: ");
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
    let output = Command::new(command).args(args).output().expect("Failed to execute command");
    println!("{}", String::from_utf8_lossy(&output.stdout));
    println!("{}", String::from_utf8_lossy(&output.stderr));
}
