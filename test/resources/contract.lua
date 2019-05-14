import "./library.lua"

function event(key, arg1, arg2)
  contract.event("event", key, arg1, arg2)
end

function set(key, arg1, arg2)
  system.setItem(key, {intVal=arg1, stringVal=arg2})
end

function get(key)
  return system.getItem(key)
end

abi.register(libraryFunc)
abi.payable(set)
abi.register_view(get)
