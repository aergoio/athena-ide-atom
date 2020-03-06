-- should set with { key, { "v1": "v1", "v2": "v2" } }
-- should get with { key }

function set(key, table)
  system.setItem(key, { v1=table.v1, v2=table.v2 })
end

function get(key)
  return system.getItem(key)
end

abi.register(set)
abi.register_view(get)
